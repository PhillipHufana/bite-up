const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customer");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/products");
const inventoryRoutes = require("./routes/inventory");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/customer", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


