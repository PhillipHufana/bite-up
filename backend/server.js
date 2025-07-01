import express from "express";
import cors from "cors";

import customerRoutes from "./routes/customer.js";
import orderRoutes from "./routes/order.js";
import catalogRoutes from "./routes/productCatalog.js";
import inventoryRoutes from "./routes/inventory.js";
import ingredientRoutes from "./routes/ingredient.js";
import productRoutes from "./routes/products.js"; 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route mounts
app.use("/api/customer", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/products", productRoutes); // 

// Health check
app.get("/api/ping", (req, res) => res.send("pong"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
