import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /records — fetch historical procurement records
router.get("/records", async (req, res) => {
  const query = `
    SELECT 
      r.receipt_id,
      r.receipt_date,
      r.supplier_name,
      ri.quantity,
      ri.ingredient_name,
      ri.brand,
      ri.unit,
      ri.unit_price
    FROM receipt r
    JOIN receiptitem ri ON r.receipt_id = ri.receipt_id
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
        unit_price,
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

      const price = parseFloat(unit_price ?? 0);
      const qty = parseFloat(quantity ?? 0);
      const isValid = !isNaN(price) && !isNaN(qty);

      if (isValid) {
        recordsMap[receipt_id].items.push({
          ingredient: ingredient_name,
          brand,
          quantity: qty,
          unit,
          price: `₱${price.toFixed(2)}`
        });

        recordsMap[receipt_id].itemCount += 1;
        recordsMap[receipt_id].totalCostValue += price;
      }
    }

    const formattedRecords = Object.values(recordsMap).map((record) => ({
      ...record,
      totalCost: `₱${record.totalCostValue.toFixed(2)}`
    }));

    res.json(formattedRecords);
  } catch (err) {
    console.error("Error fetching inventory records:", err);
    res.status(500).json({ error: "Failed to load inventory records." });
  }
});


// POST /receiptitems — bulk insert receipt items (no ingredient FK)
router.post("/receiptitems", async (req, res) => {
  const { receipt_id, items } = req.body;

  if (!receipt_id || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid input." });
  }

  try {
    let [rowCountResult] = await db.query("SELECT COUNT(*) AS count FROM receiptitem");
    let itemIndex = rowCountResult[0].count;

    for (const item of items) {
      const {
        ingredient_name,
        brand,
        unit,
        unit_price,
        quantity,
      } = item;

      itemIndex++;
      const receipt_item_id = `RCP-IT-${new Date().getFullYear()}-${String(itemIndex).padStart(3, "0")}`;

      await db.query(
        `INSERT INTO receiptitem (
          receipt_item_id, receipt_id,
          ingredient_name, brand, unit, unit_price, quantity
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          receipt_item_id,
          receipt_id,
          ingredient_name,
          brand,
          unit,
          parseFloat(unit_price),
          parseFloat(quantity)
        ]
      );
    }

    res.status(201).json({ message: "Receipt items added successfully." });
  } catch (err) {
    console.error("Failed to insert receipt items:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
