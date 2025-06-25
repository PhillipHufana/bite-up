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

// Health check route
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
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
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
      price,
      quantity,
      ml_to_gram_conversion,
      cost_per_gram,
      purchase_date,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Update Error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

// DELETE ingredient by ID
app.delete("/api/ingredients/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM ingredient WHERE ingredient_id = ?";
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Delete Error:", err);
      return res.status(500).json({ error: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    res.json({ success: true });
  });
});

// POST new ingredient
app.post("/api/ingredients", (req, res) => {
  const {
    category, name, brand, price, quantity,
    ml_to_gram_conversion, cost_per_gram, purchase_date
  } = req.body;

  const query = `
    INSERT INTO ingredient 
    (category, name, brand, unit, price, quantity, ml_to_gram_conversion, cost_per_gram, purchase_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [category, name, brand, "unit", price, quantity, ml_to_gram_conversion, cost_per_gram, purchase_date],
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, ingredient_id: result.insertId });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});