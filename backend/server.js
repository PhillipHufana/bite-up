import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "biteup"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    console.log("Connected to MySQL Database: biteup");
  }
});

// Health check
app.get("/api/ping", (req, res) => {
  res.send("pong");
});

// GET all ingredients
app.get("/api/ingredients", (req, res) => {
  const query = `
    SELECT 
      ingredient_id, name, category, brand, unit, price, 
      quantity, ml_to_gram_conversion, cost_per_gram, purchase_date 
    FROM ingredient
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL Query Error:", err);
      return res.status(500).json({ error: err });
    }
    console.log("Data fetched:", results.length, "row(s)");
    res.json(results);
  });
});

// INSERT new ingredient
app.post("/api/ingredients/bulk", (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  const updatedIds = [];

  // Function to generate the next ingredient_id
  const generateNextId = (callback) => {
    const prefix = "ING-2025-";
    const query = "SELECT ingredient_id FROM ingredient ORDER BY ingredient_id DESC LIMIT 1";

    db.query(query, (err, results) => {
      if (err) return callback(err);

      let nextNumber = 1;
      if (results.length > 0) {
        const lastId = results[0].ingredient_id;
        const match = lastId.match(/\d+$/);
        if (match) {
          nextNumber = parseInt(match[0]) + 1;
        }
      }

      const formatted = `${prefix}${String(nextNumber).padStart(2, "0")}`;
      callback(null, formatted);
    });
  };

  const processItem = (item, callback) => {
    const {
      name,
      category,
      brand,
      unit,
      price,
      quantity,
      ml_to_gram_conversion,
      cost_per_gram,
      purchase_date,
    } = item;

    if (!name || !category || price == null || quantity == null) {
      return callback(); // Skip invalid item
    }

    const checkQuery = "SELECT * FROM ingredient WHERE category = ? AND name = ?";
    db.query(checkQuery, [category, name], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        const existing = results[0];

        const incomingPrice = parseFloat(price);
        const incomingQty = parseInt(quantity);
        const currentPrice = parseFloat(existing.price);
        const currentQty = parseInt(existing.quantity);

        const priceIncreased = incomingPrice > currentPrice;
        const updatedPrice = priceIncreased ? incomingPrice : currentPrice;
        const updatedQuantity = currentQty + incomingQty;

        const updateQuery = `
          UPDATE ingredient 
          SET price = ?, quantity = ?, ml_to_gram_conversion = ?, cost_per_gram = ?, purchase_date = ?
          WHERE ingredient_id = ?
        `;

        db.query(
          updateQuery,
          [
            updatedPrice,
            updatedQuantity,
            parseFloat(ml_to_gram_conversion) || 0,
            parseFloat(cost_per_gram) || 0,
            purchase_date || new Date().toISOString().split("T")[0],
            existing.ingredient_id,
          ],
          (updateErr) => {
            if (!updateErr && priceIncreased) {
              updatedIds.push(existing.ingredient_id);
            }
            callback(updateErr);
          }
        );
      } else {
        // Insert new with custom ingredient_id
        generateNextId((idErr, newId) => {
          if (idErr) return callback(idErr);

          const insertQuery = `
            INSERT INTO ingredient 
            (ingredient_id, name, category, brand, unit, price, quantity, ml_to_gram_conversion, cost_per_gram, purchase_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          db.query(
            insertQuery,
            [
              newId,
              name,
              category,
              brand,
              unit,
              parseFloat(price),
              parseInt(quantity),
              parseFloat(ml_to_gram_conversion) || 0,
              parseFloat(cost_per_gram) || 0,
              purchase_date || new Date().toISOString().split("T")[0],
            ],
            (insertErr, result) => {
              if (!insertErr) {
                updatedIds.push(newId); // track for highlight if needed
              }
              callback(insertErr);
            }
          );
        });
      }
    });
  };

  const processAll = (index = 0) => {
    if (index >= items.length) {
      return res.status(200).json({ success: true, updatedIds });
    }
    processItem(items[index], (err) => {
      if (err) {
        console.error("Error processing item:", err);
        return res.status(500).json({ error: err.message });
      }
      processAll(index + 1);
    });
  };

  processAll();
});





// UPDATE ingredient
app.put("/api/ingredients/:id", (req, res) => {
  const { id } = req.params;
  const {
    name,
    brand,
    unit,
    price,
    quantity,
    ml_to_gram_conversion,
    cost_per_gram,
    purchase_date,
  } = req.body;

  const query = `
    UPDATE ingredient 
    SET name = ?, brand = ?, unit = ?, price = ?, quantity = ?, 
        ml_to_gram_conversion = ?, cost_per_gram = ?, purchase_date = ?
    WHERE ingredient_id = ?
  `;

  db.query(
    query,
    [
      name,
      brand,
      unit,
      parseFloat(price),
      parseInt(quantity),
      parseFloat(ml_to_gram_conversion),
      parseFloat(cost_per_gram),
      purchase_date,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Update Error:", err);
        return res.status(500).json({ error: err });
      }
      res.json({ success: true });
    }
  );
});

// DELETE ingredient by ID
app.delete("/api/ingredients/:id", (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ingredient_id." });
  }

  console.log("Attempting to delete ingredient_id:", id);

  const query = "DELETE FROM ingredient WHERE ingredient_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Delete Error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      console.warn(`Delete failed. No matching record for ingredient_id: ${id}`);
      return res.status(404).json({ error: "Item not found" });
    }

    console.log(`Ingredient deleted: ${id}`);
    res.json({ success: true });
  });
});

// GET all products
app.get("/api/products", (req, res) => {
  const sql = `
    SELECT 
      p.product_id AS id,
      p.name,
      SUM(pi.quantity_used * i.cost_per_gram) AS totalCostIngredients
    FROM product p
    JOIN productingredient pi ON p.product_id = pi.product_id
    JOIN ingredient i ON pi.ingredient_id = i.ingredient_id
    GROUP BY p.product_id`;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const mappedResults = results.map(product => ({
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
  });
});

// GET product details (ingredients)
app.get("/api/products/:id", (req, res) => {
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
  
  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error("SQL Error:", err.sqlMessage);
      return res.status(500).json([]); // Return empty array on error
    }
    res.json(results || []);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
