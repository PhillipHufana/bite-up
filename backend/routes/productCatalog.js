import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const sql = `
    SELECT 
      p.product_id AS id,
      p.name,
      SUM(pi.quantity_used * i.cost_per_gram) AS totalCostIngredients
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
      productionDate: new Date().toISOString().split("T")[0],
      desiredQuantity: "100%",
      desiredPortions: 70,
      totalIngredientWeight: 100.0,
      ingredientWeightPerPortion: 1.43,
      suggestedSellingPrice: "₱1.00",
      totalSales: "₱42.00",
      overheadExpense: "₱16.00",
      netProfit: "₱11.20",
      costPerPortion: "₱0.20",
      foodCostPercentage: "33%",
      profitPerPortion: "₱0.16",
      profitMargin: "27%",
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
      i.unit, 
      pi.quantity_used AS quantity, 
      i.quantity AS grams,
      i.cost_per_gram AS cost
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
