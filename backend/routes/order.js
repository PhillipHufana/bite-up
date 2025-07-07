import express from "express";
import db from "../db.js";

const router = express.Router();

// GET orders
router.get("/", async (req, res) => {
  const query = `
    SELECT 
  okb.order_id AS id,
  c.customer_id, c.first_name, c.last_name,
  GROUP_CONCAT(CONCAT(oi.quantity_ordered, 'x ', p.name) SEPARATOR ', ') AS order_name,
  okb.order_date AS delivery_date,
  okb.total_amount AS total,
  'Completed' AS status
FROM orders okb
JOIN customer c USING (customer_id)
JOIN orderitem oi USING (order_id)
JOIN product p USING (product_id)
GROUP BY okb.order_id, c.customer_id, c.first_name, c.last_name, okb.order_date, okb.total_amount
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
    const [rows] = await db.query("SELECT name, cost FROM product");
    res.json(rows);
  } catch (err) {
    console.error("Product fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// Insert order
router.post("/", async (req, res) => {
  const { orderItems, customer_id, total_amount, order_date } = req.body;

  if (!orderItems?.length || !customer_id) {
    return res.status(400).json({ error: "Missing order items or customer ID" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const year = new Date().getFullYear();

    // Generate next ORDER ID
    const [[lastOrder]] = await connection.query(`
      SELECT order_id FROM orders
      WHERE order_id LIKE 'ORD-${year}-%'
      ORDER BY order_id DESC LIMIT 1
    `);
    let nextOrderNum = lastOrder
      ? parseInt(lastOrder.order_id.split("-")[2]) + 1
      : 1;
    const orderId = `ORD-${year}-${String(nextOrderNum).padStart(3, "0")}`;

    // Create ORDER first
    await connection.query(
      `INSERT INTO orders (order_id, customer_id, order_date, total_amount)
       VALUES (?, ?, ?, ?)`,
      [orderId, customer_id, order_date || new Date(), total_amount || 0]
    );

    // Generate next order_item_id
    const [[lastItem]] = await connection.query(`
      SELECT order_item_id FROM orderitem
      WHERE order_item_id LIKE 'OI-${year}-%'
      ORDER BY order_item_id DESC LIMIT 1
    `);
    let nextItemNum = lastItem
      ? parseInt(lastItem.order_item_id.split("-")[2]) + 1
      : 1;

    for (const item of orderItems) {
      const [[productRow]] = await connection.query(
        `SELECT product_id FROM product WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1`,
        [item.name]
      );
      if (!productRow) throw new Error(`Product not found: ${item.name}`);
      const product_id = productRow.product_id;

      const orderItemId = `OI-${year}-${String(nextItemNum++).padStart(3, "0")}`;

      await connection.query(
        `INSERT INTO orderitem (order_item_id, order_id, product_id, quantity_ordered, price_per_unit)
         VALUES (?, ?, ?, ?, ?)`,
        [orderItemId, orderId, product_id, item.quantity, item.price]
      );

      // Deduct ingredients
      const [ingredientUsages] = await connection.query(
        `SELECT ingredient_id, quantity_used FROM productingredient WHERE product_id = ?`,
        [product_id]
      );

      for (const usage of ingredientUsages) {
        const totalDeduct = usage.quantity_used * item.quantity;
        await connection.query(
          `UPDATE ingredient SET quantity = quantity - ? WHERE ingredient_id = ?`,
          [totalDeduct, usage.ingredient_id]
        );
      }
    }

    await connection.commit();
    res.status(200).json({ message: "Order saved successfully", order_id: orderId });
  } catch (err) {
    await connection.rollback();
    console.error("SAVE ORDER ERROR:", err);
    res.status(500).json({ error: "Failed to save order", details: err.message });
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
        okb.order_id AS id,
        c.customer_id, c.first_name, c.last_name,
        GROUP_CONCAT(CONCAT(oi.quantity_ordered, 'x ', p.name) SEPARATOR ', ') AS order_name,
        okb.order_date AS delivery_date,
        okb.total_amount AS total,
        'Completed' AS status
      FROM orders okb
      JOIN customer c USING (customer_id)
      JOIN orderitem oi USING (order_id)
      JOIN product p USING (product_id)
      GROUP BY okb.order_id, c.customer_id, c.first_name, c.last_name, okb.order_date, okb.total_amount
      ORDER BY okb.order_date DESC;
      `,
      [customer_id]
    );

    res.json(results);
  } catch (error) {
    console.error("GET /orders/history/:customer_id error:", error);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

export default router;
