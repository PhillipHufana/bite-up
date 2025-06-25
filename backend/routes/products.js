const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT name FROM product");
    res.json(rows);
  } catch (err) {
    console.error("Product fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;


