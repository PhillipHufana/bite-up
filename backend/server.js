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

//create ingredients module
app.post("/api/ingredients", (req, res) => {
  const {
    name,
    category,
    brand,
    unit,
    price,
    quantity,
    ml_to_gram_conversion,
    cost_per_gram,
    purchase_date
  } = req.body;

  const query = `
    INSERT INTO ingredient 
    (name, category, brand, unit, price, quantity, ml_to_gram_conversion, cost_per_gram, purchase_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    category,
    brand,
    unit,
    price,
    quantity,
    ml_to_gram_conversion,
    cost_per_gram,
    purchase_date
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("MySQL Insert Error:", err);
      return res.status(500).json({ error: "Failed to save ingredient" });
    }
    res.status(201).json({ message: "Ingredient created successfully" });
  });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
