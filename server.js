import express from "express";
import productRoutes from "./src/routes/product.routes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/products", productRoutes);

// Porta de acesso a API
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
