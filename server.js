import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

// Porta de acesso a API
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
