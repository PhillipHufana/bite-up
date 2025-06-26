const express = require("express");
const router = express.Router();
const db = require("../db");

// GET orders
router.get("/", async (req, res) => {
  const query = `
    SELECT 
      okb.order_item_id AS id,
      c.customer_id, c.first_name, c.last_name,
      GROUP_CONCAT(p.name SEPARATOR ', ') AS order_name,
      okb.order_date AS delivery_date,
      okb.total_amount AS total,
      'Completed' AS status
    FROM orderkb okb
    JOIN customer c USING (customer_id)
    JOIN orderitem oi USING (order_id)
    JOIN product p USING (product_id)
    GROUP BY okb.order_item_id, c.customer_id, c.first_name, c.last_name, okb.order_date, okb.total_amount
    ORDER BY okb.order_date DESC
  `;
  try {
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// GET products 
router.get("/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT name, unit_cost FROM product");
    res.json(rows);
  } catch (err) {
    console.error("Product fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST — insert order
router.post("/", async (req, res) => {
  const { customer_id, orderItems, total_amount, order_date } = req.body;

  if (!customer_id || !orderItems?.length || !total_amount || !order_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const year = new Date().getFullYear();

    // Generate unique order_id
    const [[lastOrder]] = await connection.query(`
      SELECT order_id FROM orderkb
      WHERE order_id LIKE 'ORD-${year}-%'
      ORDER BY order_id DESC LIMIT 1
    `);
    let nextOrderNum = lastOrder
      ? parseInt(lastOrder.order_id.split("-")[2]) + 1
      : 1;
    const order_id = `ORD-${year}-${String(nextOrderNum).padStart(3, "0")}`;

    // Generate group order_item_id for orderkb summary
    const [[lastGroup]] = await connection.query(`
      SELECT order_item_id FROM orderkb
      WHERE order_item_id LIKE 'OI-${year}-%'
      ORDER BY order_item_id DESC LIMIT 1
    `);
    let nextGroupNum = lastGroup
      ? parseInt(lastGroup.order_item_id.split("-")[2]) + 1
      : 1;
    const orderItemGroupId = `OI-${year}-${String(nextGroupNum).padStart(
      3,
      "0"
    )}`;

    // Also fetch the last individual order_item_id for orderitem table
    const [[lastItem]] = await connection.query(`
      SELECT order_item_id FROM orderitem
      WHERE order_item_id LIKE 'OI-${year}-%'
      ORDER BY order_item_id DESC LIMIT 1
    `);
    let nextItemNum = lastItem
      ? parseInt(lastItem.order_item_id.split("-")[2]) + 1
      : nextGroupNum + 1;

    // Insert into orderkb (summary)
    await connection.query(
      `INSERT INTO orderkb (order_item_id, customer_id, order_id, order_date, total_amount)
       VALUES (?, ?, ?, ?, ?)`,
      [orderItemGroupId, customer_id, order_id, order_date, total_amount]
    );

    // INSERT INTO orderhistory
    await connection.query(
      `INSERT INTO orderhistory (orderhistory_id, customer_id, order_id, date, status)
   VALUES (?, ?, ?, ?, ?)`,
      [orderItemGroupId, customer_id, order_id, order_date, "Completed"]
    );

    // Insert each item into orderitem table
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];

      const [[productRow]] = await connection.query(
        `SELECT product_id FROM product WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1`,
        [item.name]
      );

      if (!productRow) {
        throw new Error(`Product not found: ${item.name}`);
      }

      const product_id = productRow.product_id;

      // Use separate sequence for individual item ID
      const itemId = `OI-${year}-${String(nextItemNum++).padStart(3, "0")}`;

      await connection.query(
        `INSERT INTO orderitem (order_item_id, order_id, product_id, quantity_ordered, price_per_unit)
         VALUES (?, ?, ?, ?, ?)`,
        [itemId, order_id, product_id, item.quantity, item.price]
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Order saved", order_id });
  } catch (error) {
    await connection.rollback();
    console.error("Order insert failed:", error);
    res.status(500).json({ error: "Insert failed", details: error.message });
  } finally {
    connection.release();
  }
});

// GET order history by customer_id
router.get("/history/:customer_id", async (req, res) => {
  const { customer_id } = req.params;

  try {
    const [results] = await db.query(
      `
      SELECT 
        okb.order_id,
        DATE_FORMAT(okb.order_date, '%Y-%m-%d') AS date,
        'Completed' AS status,
        GROUP_CONCAT(CONCAT(oi.quantity_ordered, 'x ', p.name, ' @ ', FORMAT(oi.quantity_ordered * oi.price_per_unit, 2)) SEPARATOR ', ') AS items,
        okb.total_amount AS total
      FROM orderkb okb
      JOIN orderitem oi ON okb.order_id = oi.order_id
      JOIN product p ON oi.product_id = p.product_id
      WHERE okb.customer_id = ?
      GROUP BY okb.order_id, okb.order_date, okb.total_amount
      ORDER BY okb.order_date DESC
      `,
      [customer_id]
    );

    res.json(results);
  } catch (error) {
    console.error("GET /orders/history/:customer_id error:", error);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

module.exports = router;
