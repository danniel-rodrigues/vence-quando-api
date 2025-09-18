import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

// Usando middleware em TODAS as rotas abaixo. Agora, toda requisição
// para /products (qualquer que seja o método) passará primeiro pelo
// "protectRouter" antes de chegar ao controller.
router.use(protectRoute);

// Definição das rotas para o CRUD de produtos

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
