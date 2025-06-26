const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/inventory/records
router.get("/records", async (req, res) => {
  const query = `
    SELECT 
      r.receipt_id,
      r.receipt_date,
      r.supplier_name,
      r.total_cost,
      ri.quantity,
      ri.unit_price,
      i.name AS ingredient_name,
      i.brand,
      i.unit
    FROM receipt r
    JOIN receiptitem ri ON r.receipt_id = ri.receipt_id
    JOIN ingredient i ON ri.ingredient_id = i.ingredient_id
    ORDER BY r.receipt_date DESC
  `;

  try {
    const [rows] = await db.query(query);
    const recordsMap = {};

    rows.forEach(row => {
      const {
        receipt_id,
        receipt_date,
        supplier_name,
        total_cost,
        ingredient_name,
        brand,
        unit,
        unit_price,
        quantity
      } = row;

      if (!recordsMap[receipt_id]) {
        recordsMap[receipt_id] = {
          id: receipt_id,
          date: receipt_date,
          supplier: supplier_name,
          totalCost: `P ${parseFloat(total_cost).toFixed(2)}`,
          itemCount: 0,
          items: []
        };
      }

      recordsMap[receipt_id].items.push({
        ingredient: ingredient_name,
        brand: brand,
        quantity: quantity,
        unit: unit,
        unitPrice: `P ${parseFloat(unit_price).toFixed(2)}`,
        totalCost: `P ${(parseFloat(unit_price) * parseFloat(quantity)).toFixed(2)}`
      });

      recordsMap[receipt_id].itemCount += 1;
    });

    res.json(Object.values(recordsMap));
  } catch (err) {
    console.error("Error fetching inventory records:", err);
    res.status(500).json({ error: "Failed to load inventory records." });
  }
});

module.exports = router;
