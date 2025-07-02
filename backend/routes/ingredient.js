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

// BULK INSERT or UPDATE ingredients
router.post("/bulk", async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  const updatedIds = [];
  const newlyInserted = [];       // Same name/category but new date → BOLD
  const completelyNewIds = [];    // New name/category → highlight only

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

    return `${prefix}${String(nextNumber).padStart(3, "0")}`;
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
        cost_per_unit,
        purchase_date,
      } = item;

      if (!name || !category || price == null || quantity == null || !purchase_date) continue;

      let convertedQty = parseFloat(quantity);
      let normalizedUnit = unit.toLowerCase();

      switch (normalizedUnit) {
        case "grams":
        case "gr":
        case "g":
          normalizedUnit = "gr";
          break;
        case "kilograms":
        case "kg":
          convertedQty *= 1000;
          normalizedUnit = "gr";
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
          continue;
      }

      // Check for same name + category + purchase_date
      const [existingRows] = await db.query(
        `SELECT * FROM ingredient WHERE category = ? AND name = ? AND purchase_date = ?`,
        [category, name, purchase_date]
      );

      if (existingRows.length > 0) {
        // Update existing record (same date)
        const existing = existingRows[0];
        const incomingPrice = parseFloat(price);
        const currentPrice = parseFloat(existing.price);
        const updatedPrice = incomingPrice > currentPrice ? incomingPrice : currentPrice;
        const updatedQuantity = parseFloat(existing.quantity) + convertedQty;

        await db.query(
          `UPDATE ingredient 
           SET price = ?, quantity = ?, cost_per_unit = ?, unit = ?, brand = ?
           WHERE ingredient_id = ?`,
          [
            updatedPrice,
            updatedQuantity,
            parseFloat(cost_per_unit) || 0,
            normalizedUnit,
            brand,
            existing.ingredient_id,
          ]
        );

        updatedIds.push(existing.ingredient_id);
      } else {
        // New purchase date — insert new row
        const newId = await generateNextId();
        await db.query(
          `INSERT INTO ingredient 
           (ingredient_id, name, category, brand, unit, price, quantity, cost_per_unit, purchase_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newId,
            name,
            category,
            brand,
            normalizedUnit,
            parseFloat(price),
            convertedQty,
            parseFloat(cost_per_unit) || 0,
            purchase_date
          ]
        );
        updatedIds.push(newId);

        // Determine if this name/category already exists with other dates
        const [checkOtherRows] = await db.query(
          `SELECT * FROM ingredient WHERE category = ? AND name = ?`,
          [category, name]
        );

        if (checkOtherRows.length > 1) {
          // This means it already exists but with different date(s)
          newlyInserted.push(newId); // should be bold
        } else {
          // First time this name/category was ever seen
          completelyNewIds.push(newId); // just highlight
        }
      }
    }

    res.status(200).json({
      success: true,
      updatedIds,
      newlyInserted,      // BOLD
      completelyNewIds,   // YELLOW BG ONLY
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