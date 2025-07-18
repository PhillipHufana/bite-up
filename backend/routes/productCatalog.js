import express from "express";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET all products with total cost (FIFO-based per ingredient)
router.get("/", async (req, res) => {
  const sql = `
    SELECT 
      p.product_id AS id,
      p.name,
      SUM(
        pi.quantity_needed * (
          SELECT cost_per_unit
          FROM ingredient i
          WHERE LOWER(TRIM(i.name)) = LOWER(TRIM(pi.ingredients))
            AND i.quantity > 0
          ORDER BY i.purchase_date ASC
          LIMIT 1
        )
      ) AS totalCostIngredients
    FROM product p
    JOIN productingredient pi ON p.product_id = pi.product_id
    GROUP BY p.product_id, p.name
  `;

  try {
    const [results] = await db.query(sql);

    const mappedResults = results.map((product) => ({
      id: product.id,
      name: product.name,
      totalCostIngredients: product.totalCostIngredients || 0,
    }));

    res.json(mappedResults);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET ingredient names for autocomplete
router.get("/ingredients/all-names", async (req, res) => {
  try {
    const [results] = await db.query("SELECT DISTINCT name FROM ingredient");
    const names = results.map((row) => row.name);
    res.json(names);
  } catch (err) {
    console.error("Error fetching ingredient names:", err.message);
    res.status(500).json({ error: "Failed to fetch ingredient names" });
  }
});

// POST new product with ingredients
router.post("/", async (req, res) => {
  const { name, ingredients } = req.body;

  if (!name || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Invalid product data" });
  }

  const productId = uuidv4();

  try {
    // Insert product
    await db.query("INSERT INTO product (product_id, name) VALUES (?, ?)", [productId, name]);

    for (const ing of ingredients) {
      const [rows] = await db.query("SELECT unit FROM ingredient WHERE name = ? LIMIT 1", [ing.name]);
      const unit = rows.length > 0 ? rows[0].unit : "grams";

      await db.query(
        `INSERT INTO productingredient (product_id, product_name, ingredients, quantity_needed, unit)
         VALUES (?, ?, ?, ?, ?)`,
        [productId, name, ing.name, ing.quantity, unit]
      );
    }

    res.status(201).json({ message: "Product and ingredients saved", id: productId });
  } catch (err) {
    console.error("Error inserting product:", err.message);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// GET detailed costing per ingredient for a given product
router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT 
      pi.ingredients AS name,
      (
        SELECT brand
        FROM ingredient i
        WHERE LOWER(TRIM(i.name)) = LOWER(TRIM(pi.ingredients))
          AND i.quantity > 0
        ORDER BY i.purchase_date ASC
        LIMIT 1
      ) AS brand,
      pi.unit,
      CAST(pi.quantity_needed AS FLOAT) AS quantity,
      (
        SELECT cost_per_unit
        FROM ingredient i
        WHERE LOWER(TRIM(i.name)) = LOWER(TRIM(pi.ingredients))
          AND i.quantity > 0
        ORDER BY i.purchase_date ASC
        LIMIT 1
      ) AS cost
    FROM productingredient pi
    WHERE pi.product_id = ?
  `;

  try {
    const [results] = await db.query(sql, [productId]);
    res.json(results || []);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json([]);
  }
});

  // Add new ingredient to existing product
  router.post("/:productId/ingredient", async (req, res) => {
    const { productId } = req.params;
    const { ingredientName, quantity } = req.body;

    if (!ingredientName || !quantity) {
      return res.status(400).json({ error: "Missing data." });
    }

    try {
      // Get product name
      const [productRows] = await db.query("SELECT name FROM product WHERE product_id = ?", [productId]);
      if (productRows.length === 0) {
        return res.status(404).json({ error: "Product not found." });
      }
      const productName = productRows[0].name;

      // Get brand, unit, cost_per_unit for the ingredient
      const [ingredientRows] = await db.query(`
        SELECT brand, unit, cost_per_unit
        FROM ingredient
        WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) AND quantity > 0
        ORDER BY purchase_date ASC
        LIMIT 1
      `, [ingredientName]);

      if (ingredientRows.length === 0) {
        return res.status(404).json({ error: "Ingredient not found in inventory." });
      }

      const { brand, unit, cost_per_unit } = ingredientRows[0];

      // Insert into productingredient table
      await db.query(`
        INSERT INTO productingredient (product_id, product_name, ingredients, quantity_needed, unit)
        VALUES (?, ?, ?, ?, ?)
      `, [productId, productName, ingredientName, quantity, unit]);

      const totalCost = cost_per_unit * quantity;

      // Return inserted data to update UI
      res.status(201).json({
        name: ingredientName,
        quantity: parseFloat(quantity),
        unit,
        brand,
        cost: cost_per_unit,
        totalCost,
      });
    } catch (err) {
      console.error("Error inserting ingredient:", err.message);
      res.status(500).json({ error: "Failed to add ingredient." });
    }
  });

  // DELETE specific ingredient from product
  router.delete("/:productId/ingredient", async (req, res) => {
    const { productId } = req.params;
    const { ingredientName } = req.body;

    if (!ingredientName) {
      return res.status(400).json({ error: "Missing ingredient name." });
    }

    try {
      await db.query(
        `DELETE FROM productingredient
        WHERE product_id = ? AND ingredients = ?`,
        [productId, ingredientName]
      );

      res.status(200).json({ message: "Ingredient deleted successfully." });
    } catch (err) {
      console.error("Error deleting ingredient:", err.message);
      res.status(500).json({ error: "Failed to delete ingredient." });
    }
  });

  // UPDATE quantity of a specific ingredient in a product
  router.put("/:productId/ingredient", async (req, res) => {
    const { productId } = req.params;
    const { ingredientName, newQuantity } = req.body;

    if (!ingredientName || newQuantity == null) {
      return res.status(400).json({ error: "Missing data." });
    }

    try {
      await db.query(
        `UPDATE productingredient
        SET quantity_needed = ?
        WHERE product_id = ? AND ingredients = ?`,
        [newQuantity, productId, ingredientName]
      );

      res.status(200).json({ message: "Quantity updated successfully." });
    } catch (err) {
      console.error("Error updating ingredient:", err.message);
      res.status(500).json({ error: "Failed to update ingredient." });
    }
  });



export default router;
