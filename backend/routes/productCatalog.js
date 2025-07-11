import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const sql = `
    SELECT 
      p.product_id AS id,
      p.name,
      SUM(pi.quantity_needed * i.cost_per_unit) AS totalCostIngredients
    FROM product p
    JOIN productingredient pi ON p.product_id = pi.product_id
    JOIN ingredient i ON pi.ingredient_id = i.ingredient_id
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
    JOIN ingredient i ON pi.ingredient_id = i.ingredient_id
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
