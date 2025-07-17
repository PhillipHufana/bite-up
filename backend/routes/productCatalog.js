import express from "express";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid"; // Install with: npm install uuid

const router = express.Router();

// GET all products with total cost of ingredients
router.get("/", async (req, res) => {
  const sql = `
    SELECT 
      p.product_id AS id,
      p.name,
      SUM(pi.quantity_needed * COALESCE(ing.cost_per_unit, 0)) AS totalCostIngredients
    FROM product p
    JOIN productingredient pi ON p.product_id = pi.product_id
    LEFT JOIN (
      SELECT name, MIN(cost_per_unit) AS cost_per_unit
      FROM ingredient
      GROUP BY name
    ) ing ON LOWER(TRIM(pi.ingredients)) = LOWER(TRIM(ing.name))
    GROUP BY p.product_id`;

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

// GET all ingredient names for autocomplete
router.get("/ingredients/all-names", async (req, res) => {
  try {
    const [results] = await db.query("SELECT name FROM ingredient");
    const names = results.map((row) => row.name);
    res.json(names);
  } catch (err) {
    console.error("Error fetching ingredient names:", err.message);
    res.status(500).json({ error: "Failed to fetch ingredient names" });
  }
});

// POST create new product
router.post("/", async (req, res) => {
  const { name, ingredients } = req.body;

  if (!name || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Invalid product data" });
  }

  const productId = uuidv4(); // Generate a unique product_id

  try {
    // Insert into `product` table
    await db.query("INSERT INTO product (product_id, name) VALUES (?, ?)", [productId, name]);

    // Insert each ingredient
    for (const ing of ingredients) {
      // Fetch unit from ingredient table
      const [rows] = await db.query("SELECT unit FROM ingredient WHERE name = ?", [ing.name]);
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



// GET product details by ID
router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  const sql = `
    SELECT 
      i.name,
      i.brand,
      pi.unit,
      CAST(pi.quantity_needed AS FLOAT) AS quantity,
      CAST(i.cost_per_unit AS FLOAT) AS cost
    FROM productingredient pi
    LEFT JOIN ingredient i 
      ON LOWER(TRIM(pi.ingredients)) = LOWER(TRIM(i.name))
    WHERE pi.product_id = ?`;

  try {
    const [results] = await db.query(sql, [productId]);
    res.json(results || []);
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json([]);
  }
});

export default router;
