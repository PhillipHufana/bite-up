import express from "express";
import db from "../db.js";

const router = express.Router();

async function generateCustomerId() {
  const [rows] = await db.query(
    "SELECT customer_id FROM customer ORDER BY customer_id DESC LIMIT 1"
  );

  let nextNum = 1;
  if (rows.length > 0) {
    const lastId = rows[0].customer_id;
    const lastNum = parseInt(lastId.split("-").pop(), 10);
    nextNum = lastNum + 1;
  }
  const padded = String(nextNum).padStart(3, "0");
  return `CUS-2025-${padded}`;
}

// GET all customers
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM customer");
    res.json(results);
  } catch (error) {
    console.error("GET /customer error:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// POST a new customer
router.post("/", async (req, res) => {
  const { first_name, last_name, contact_number, email, address } = req.body;

  if (!first_name || !last_name || !contact_number || !email || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newId = await generateCustomerId();
    const query = `INSERT INTO customer (customer_id, first_name, last_name, contact_number, email, address)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    await db.query(query, [newId, first_name, last_name, contact_number, email, address]);
    res.status(201).json({ message: "Customer added successfully", id: newId });
  } catch (error) {
    console.error("POST /customer error:", error);
    res.status(500).json({ error: "Failed to add customer" });
  }
});

export default router;