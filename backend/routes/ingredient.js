import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all ingredients
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        ingredient_id, name, category, brand, unit, price, 
        quantity, cost_per_gram, purchase_date 
      FROM ingredient
    `);
    res.json(results);
  } catch (err) {
    console.error("Fetch ingredients error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// BULK INSERT or UPDATE ingredients
router.post("/bulk", async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  const updatedIds = [];

  const generateNextId = async () => {
    const prefix = "ING-2025-";
    const [results] = await db.query("SELECT ingredient_id FROM ingredient ORDER BY ingredient_id DESC LIMIT 1");
    let nextNumber = 1;

    if (results.length > 0) {
      const lastId = results[0].ingredient_id;
      const match = lastId.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0]) + 1;
      }
    }

    return `${prefix}${String(nextNumber).padStart(2, "0")}`;
  };

  try {
    for (const item of items) {
      let {
        name,
        category,
        brand,
        unit,
        price,
        quantity,
        cost_per_gram,
        purchase_date,
      } = item;

      if (!name || !category || price == null || quantity == null) continue;

      // Normalize unit and convert quantity
      let convertedQty = parseFloat(quantity);
      let normalizedUnit = unit.toLowerCase();

      switch (normalizedUnit) {
      case "grams":
      case "gr":
      case "g":
        normalizedUnit = "g";
        break;
      case "kilograms":
      case "kg":
        convertedQty *= 1000;
        normalizedUnit = "g";
        break;
      case "milliliters":
      case "ml":
        normalizedUnit = "ml";
        break;
      case "liters":
      case "l":
        convertedQty *= 1000;
        normalizedUnit = "ml";
        break;
      case "pieces":
      case "piece":
      case "pc":
        normalizedUnit = "pc";
        break;
      default:
        console.warn(`Unsupported unit: ${unit}`);
        continue; // this skips the item!
    }


      const [existingRows] = await db.query(
        "SELECT * FROM ingredient WHERE category = ? AND name = ?",
        [category, name]
      );

      if (existingRows.length > 0) {
        const existing = existingRows[0];
        const incomingPrice = parseFloat(price);
        const currentPrice = parseFloat(existing.price);
        const updatedPrice = incomingPrice > currentPrice ? incomingPrice : currentPrice;
        const updatedQuantity = parseFloat(existing.quantity) + convertedQty;

        await db.query(
          `UPDATE ingredient 
           SET price = ?, quantity = ?, cost_per_gram = ?, purchase_date = ?, unit = ?
           WHERE ingredient_id = ?`,
          [
            updatedPrice,
            updatedQuantity,
            parseFloat(cost_per_gram) || 0,
            purchase_date,
            normalizedUnit,
            existing.ingredient_id,
          ]
        );

        updatedIds.push(existing.ingredient_id);
      } else {
        const newId = await generateNextId();
        await db.query(
          `INSERT INTO ingredient 
           (ingredient_id, name, category, brand, unit, price, quantity, cost_per_gram, purchase_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newId,
            name,
            category,
            brand,
            normalizedUnit,
            parseFloat(price),
            convertedQty,
            parseFloat(cost_per_gram) || 0,
            purchase_date
          ]
        );
        updatedIds.push(newId);
      }
    }

    res.status(200).json({ success: true, updatedIds });
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
    cost_per_gram,
    purchase_date,
  } = req.body;

  try {
    await db.query(
      `UPDATE ingredient 
       SET name = ?, brand = ?, unit = ?, price = ?, quantity = ?, cost_per_gram = ?, purchase_date = ?
       WHERE ingredient_id = ?`,
      [
        name,
        brand,
        unit,
        parseFloat(price),
        parseFloat(quantity),
        parseFloat(cost_per_gram),
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
