import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all ingredients
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        ingredient_id, name, category, brand, unit, price, 
        quantity, cost_per_unit, purchase_date 
      FROM ingredient
    `);
    res.json(results);
  } catch (err) {
    console.error("Fetch ingredients error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// POST /api/ingredient/bulk
router.post("/bulk", async (req, res) => {
  const { items, supplier_name = "Unknown Supplier", purchase_date } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0 || !purchase_date) {
    return res.status(400).json({ error: "Missing items or purchase_date" });
  }

  const updatedIds = [], newlyInserted = [], completelyNewIds = [], receiptItems = [];
  let totalCost = 0;

  const generateNextId = async () => {
    const prefix = "ING-2025-";
    const [results] = await db.query(`SELECT ingredient_id FROM ingredient WHERE ingredient_id LIKE '${prefix}%'`);
    let max = 0;
    for (const row of results) {
      const match = row.ingredient_id.match(/(\d{3})$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    }
    return `${prefix}${String(max + 1).padStart(3, "0")}`;
  };

  const generateNextReceiptId = async () => {
    const prefix = "REC-2025-";
    const [results] = await db.query(`SELECT receipt_id FROM receipt WHERE receipt_id LIKE '${prefix}%'`);
    let max = 0;
    for (const row of results) {
      const match = row.receipt_id.match(/(\d{3})$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    }
    return `${prefix}${String(max + 1).padStart(3, "0")}`;
  };

  const generateNextReceiptItemId = async () => {
    const prefix = "RCP-IT-2025-";
    const [results] = await db.query(`SELECT receipt_item_id FROM receiptitem WHERE receipt_item_id LIKE '${prefix}%'`);
    let max = 0;
    for (const row of results) {
      const match = row.receipt_item_id.match(/(\d{3})$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    }
    return `${prefix}${String(max + 1).padStart(3, "0")}`;
  };

  const receiptDate = purchase_date;
  const receiptId = await generateNextReceiptId();

  try {
    for (const item of items) {
      const {
        name,
        category,
        brand,
        unit,
        price,
        quantity,
        cost_per_unit
      } = item;

      if (!name || !category || price == null || quantity == null) continue;

      const itemDate = purchase_date;
      let convertedQty = parseFloat(quantity);
      let normalizedUnit = unit.toLowerCase();

      switch (normalizedUnit) {
        case "grams": case "gr": case "g": normalizedUnit = "gr"; break;
        case "kilograms": case "kg": convertedQty *= 1000; normalizedUnit = "gr"; break;
        case "milliliters": case "ml": normalizedUnit = "ml"; break;
        case "liters": case "l": convertedQty *= 1000; normalizedUnit = "ml"; break;
        case "pieces": case "piece": case "pc": normalizedUnit = "pc"; break;
        default: console.warn(`Unsupported unit: ${unit}`); continue;
      }

      const [existingRows] = await db.query(
        `SELECT * FROM ingredient WHERE category = ? AND name = ? AND purchase_date = ?`,
        [category, name, itemDate]
      );

      let ingredientId;
      if (existingRows.length > 0) {
        const existing = existingRows[0];
        const incomingPrice = parseFloat(price);
        const currentPrice = parseFloat(existing.price);
        const updatedPrice = incomingPrice > currentPrice ? incomingPrice : currentPrice;
        const updatedQuantity = parseFloat(existing.quantity) + convertedQty;

        await db.query(
          `UPDATE ingredient 
           SET price = ?, quantity = ?, cost_per_unit = ?, unit = ?, brand = ?
           WHERE ingredient_id = ?`,
          [updatedPrice, updatedQuantity, parseFloat(cost_per_unit) || 0, normalizedUnit, brand, existing.ingredient_id]
        );

        ingredientId = existing.ingredient_id;
        updatedIds.push(ingredientId);
      } else {
        ingredientId = await generateNextId();
        await db.query(
          `INSERT INTO ingredient 
           (ingredient_id, name, category, brand, unit, price, quantity, cost_per_unit, purchase_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [ingredientId, name, category, brand, normalizedUnit, parseFloat(price), convertedQty, parseFloat(cost_per_unit) || 0, itemDate]
        );
        updatedIds.push(ingredientId);

        const [checkOtherRows] = await db.query(`SELECT * FROM ingredient WHERE category = ? AND name = ?`, [category, name]);
        if (checkOtherRows.length > 1) newlyInserted.push(ingredientId);
        else completelyNewIds.push(ingredientId);
      }

      receiptItems.push([ingredientId, convertedQty, parseFloat(price)]);
      totalCost += parseFloat(price) * convertedQty;
    }

    await db.query(
      `INSERT INTO receipt (receipt_id, receipt_date, supplier_name, total_cost)
       VALUES (?, ?, ?, ?)`,
      [receiptId, receiptDate, supplier_name, totalCost]
    );

    for (const [ingredientId, quantity, unit_price] of receiptItems) {
      const receiptItemId = await generateNextReceiptItemId();
      await db.query(
        `INSERT INTO receiptitem (receipt_item_id, receipt_id, ingredient_id, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?)`,
        [receiptItemId, receiptId, ingredientId, quantity, unit_price]
      );
    }

    res.status(200).json({
      success: true,
      updatedIds,
      newlyInserted,
      completelyNewIds,
      receiptId,
      totalCost: totalCost.toFixed(2)
    });
  } catch (err) {
    console.error("Error processing bulk insert:", err.message);
    res.status(500).json({ error: err.message });
  }
});




// UPDATE ingredient
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    brand,
    unit,
    price,
    quantity,
    cost_per_unit,
    purchase_date,
  } = req.body;

  try {
    await db.query(
      `UPDATE ingredient 
       SET name = ?, brand = ?, unit = ?, price = ?, quantity = ?, cost_per_unit = ?, purchase_date = ?
       WHERE ingredient_id = ?`,
      [
        name,
        brand,
        unit,
        parseFloat(price),
        parseFloat(quantity),
        parseFloat(cost_per_unit),
        purchase_date,
        id,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE ingredient
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ingredient_id." });
  }

  try {
    const [result] = await db.query("DELETE FROM ingredient WHERE ingredient_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;