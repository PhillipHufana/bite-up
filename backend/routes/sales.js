import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/weekly", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        SUM(o.total_amount) AS total_sales,
        WEEK(oh.date, 1) AS week
      FROM orderhistory oh
      JOIN orders o ON oh.order_id = o.order_id
      WHERE oh.status = 'Completed'
        AND WEEK(oh.date, 1) = WEEK(CURDATE(), 1)
        AND YEAR(oh.date) = YEAR(CURDATE())
      GROUP BY WEEK(oh.date, 1)
    `);
    res.json(results);
  } catch (err) {
    console.error("Error fetching weekly sales:", err);
    res.status(500).send("Failed to fetch weekly sales");
  }
});

router.get("/monthly", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        SUM(o.total_amount) AS total_sales,
        MONTH(oh.date) AS month
      FROM orderhistory oh
      JOIN orders o ON oh.order_id = o.order_id
      WHERE oh.status = 'Completed'
        AND MONTH(oh.date) = MONTH(CURDATE())
        AND YEAR(oh.date) = YEAR(CURDATE())
      GROUP BY MONTH(oh.date)
    `);
    res.json(results);
  } catch (err) {
    console.error("Error fetching monthly sales:", err);
    res.status(500).send("Failed to fetch monthly sales");
  }
});

router.get("/yearly", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        SUM(o.total_amount) AS total_sales,
        YEAR(oh.date) AS year
      FROM orderhistory oh
      JOIN orders o ON oh.order_id = o.order_id
      WHERE oh.status = 'Completed'
        AND YEAR(oh.date) = YEAR(CURDATE())
      GROUP BY YEAR(oh.date)
    `);
    res.json(results);
  } catch (err) {
    console.error("Error fetching yearly sales:", err);
    res.status(500).send("Failed to fetch yearly sales");
  }
});

router.get("/profit", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        SUM(total_sales) AS total_revenue,
        SUM(net_profit) AS total_profit
      FROM foodcosting
    `);
    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching profit and revenue:", err);
    res.status(500).send("Failed to fetch profit and revenue");
  }
});

router.get("/top-items", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        p.name AS product_name,
        SUM(oi.quantity_ordered) AS total_sold,
        SUM(oi.quantity_ordered * oi.price_per_unit) AS revenue
      FROM orderitem oi
      JOIN product p ON oi.product_id = p.product_id
      GROUP BY oi.product_id, p.name
      ORDER BY total_sold DESC
      LIMIT 3
    `);
    res.json(results);
  } catch (err) {
    console.error("Error fetching top selling items:", err);
    res.status(500).send("Failed to fetch top selling items");
  }
});

export default router;
