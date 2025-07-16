import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/records", async (req, res) => {
  const query = `
    SELECT 
      r.receipt_id,
      r.receipt_date,
      r.supplier_name,
      ri.quantity,
      i.name AS ingredient_name,
      i.brand,
      i.unit,
      i.price AS ingredient_price
    FROM receipt r
    JOIN receiptitem ri ON r.receipt_id = ri.receipt_id
    JOIN ingredient i ON ri.ingredient_id = i.ingredient_id
    ORDER BY r.receipt_date DESC
  `;

  try {
    const [rows] = await db.query(query);
    const recordsMap = {};

    for (const row of rows) {
      const {
        receipt_id,
        receipt_date,
        supplier_name,
        ingredient_name,
        brand,
        unit,
        ingredient_price,
        quantity,
      } = row;

      if (!recordsMap[receipt_id]) {
        recordsMap[receipt_id] = {
          id: receipt_id,
          date: receipt_date,
          supplier: supplier_name,
          totalCostValue: 0,
          itemCount: 0,
          items: [],
        };
      }

      const price = parseFloat(ingredient_price);
      const qty = parseFloat(quantity);

      // Ensure values are valid numbers
      if (!isNaN(price) && !isNaN(qty)) {
        const itemSubtotal = price * qty;

        recordsMap[receipt_id].items.push({
          ingredient: ingredient_name,
          brand: brand,
          quantity: qty,
          unit: unit,
          price: `P ${price.toFixed(2)}`,
        });

        recordsMap[receipt_id].itemCount += 1;
        recordsMap[receipt_id].totalCostValue += itemSubtotal;
      }
    }

    const formattedRecords = Object.values(recordsMap).map((record) => ({
      ...record,
      totalCost: `P ${record.totalCostValue.toFixed(2)}`, 
    }));

    res.json(formattedRecords);
  } catch (err) {
    console.error("Error fetching inventory records:", err);
    res.status(500).json({ error: "Failed to load inventory records." });
  }
});

export default router;
