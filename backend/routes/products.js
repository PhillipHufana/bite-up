// routes/products.js
import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT name, cost FROM product");
    res.json(rows);
  } catch (err) {
    console.error("Product fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router; 
