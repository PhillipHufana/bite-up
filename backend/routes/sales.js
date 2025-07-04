import express from "express";
import db from "../db.js";

const router = express.Router();

// WEEKLY SALES
router.get("/weekly", async (req, res) => {
  try {
    const { year, month, week } = req.query;
    const y = parseInt(year);
    const m = parseInt(month);
    const w = parseInt(week);

    if (!y || !m || !w || w < 1 || w > 6) {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    const monthStart = new Date(y, m - 1, 1);
    const monthEnd = new Date(y, m, 0);
    const weeks = [];

    // First week: from 1st to first Saturday
    const firstWeekStart = new Date(monthStart);
    const firstWeekEnd = new Date(firstWeekStart);
    const dow = firstWeekStart.getDay(); // Sunday=0
    const daysToSat = (6 - dow + 7) % 7;
    firstWeekEnd.setDate(firstWeekStart.getDate() + daysToSat);
    if (firstWeekEnd > monthEnd) firstWeekEnd.setTime(monthEnd.getTime());

    weeks.push({
      start: firstWeekStart.toISOString().slice(0, 10),
      end: firstWeekEnd.toISOString().slice(0, 10),
    });

    // Remaining weeks: Sunday to Saturday
    let currentStart = new Date(firstWeekEnd);
    currentStart.setDate(currentStart.getDate() + 1);

    while (currentStart <= monthEnd) {
      const weekStart = new Date(currentStart);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (weekEnd > monthEnd) weekEnd.setTime(monthEnd.getTime());

      weeks.push({
        start: weekStart.toISOString().slice(0, 10),
        end: weekEnd.toISOString().slice(0, 10),
      });

      currentStart.setDate(currentStart.getDate() + 7);
    }

    const selectedWeek = weeks[w - 1];
    if (!selectedWeek) {
      return res.status(400).json({ error: "Week out of range" });
    }

    const [results] = await db.query(
      `
      SELECT 
        SUM(o.total_amount) AS total_sales
      FROM orderhistory oh
      JOIN orders o ON oh.order_id = o.order_id
      WHERE oh.status = 'Completed'
        AND DATE(oh.date) BETWEEN ? AND ?
      `,
      [selectedWeek.start, selectedWeek.end]
    );

    res.json([{ total_sales: results[0]?.total_sales || 0 }]);
  } catch (err) {
    console.error("Error fetching weekly sales:", err);
    res.status(500).send("Failed to fetch weekly sales");
  }
});

// MONTHLY SALES
router.get("/monthly", async (req, res) => {
  try {
    const { year, month } = req.query;
    const y = parseInt(year);
    const m = parseInt(month);
    const start = `${y}-${String(m).padStart(2, "0")}-01`;
    const end = new Date(y, m, 0).toISOString().slice(0, 10);

    const [results] = await db.query(
      `
      SELECT 
        SUM(o.total_amount) AS total_sales,
        MONTH(oh.date) AS month
      FROM orderhistory oh
      JOIN orders o ON oh.order_id = o.order_id
      WHERE oh.status = 'Completed'
        AND oh.date BETWEEN ? AND ?
      GROUP BY MONTH(oh.date)
      `,
      [start, end]
    );

    res.json(results);
  } catch (err) {
    console.error("Error fetching monthly sales:", err);
    res.status(500).send("Failed to fetch monthly sales");
  }
});

// YEARLY SALES
router.get("/yearly", async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const [results] = await db.query(
      `
      SELECT 
        SUM(o.total_amount) AS total_sales,
        YEAR(oh.date) AS year
      FROM orderhistory oh
      JOIN orders o ON oh.order_id = o.order_id
      WHERE oh.status = 'Completed'
        AND YEAR(oh.date) = ?
      GROUP BY YEAR(oh.date)
      `,
      [year]
    );

    res.json(results);
  } catch (err) {
    console.error("Error fetching yearly sales:", err);
    res.status(500).send("Failed to fetch yearly sales");
  }
});

// TOP SELLING ITEMS
router.get("/top-items", async (req, res) => {
  try {
    const [results] = await db.query(
      `
      SELECT 
        p.name AS product_name,
        SUM(oi.quantity_ordered) AS total_sold,
        SUM(oi.quantity_ordered * oi.price_per_unit) AS revenue
      FROM orderitem oi
      JOIN product p ON oi.product_id = p.product_id
      GROUP BY oi.product_id, p.name
      ORDER BY total_sold DESC
      LIMIT 3
      `
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching top selling items:", err);
    res.status(500).send("Failed to fetch top selling items");
  }
});

export default router;
