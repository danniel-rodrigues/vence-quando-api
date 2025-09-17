// Importa o Router do Express
import { Router } from "express";

// Importar o Controller de produtos
// Boa prática - importar todas as funções de uma vez
import * as productController from "../controllers/product.controller.js";

// Importando middleware de proteção
import { protectRoute } from "../middlewares/auth.middleware.js";

// Inicializar o Router
const router = Router();

// Usando middleware em TODAS as rotas abaixo. Agora, toda requisição
// para /products (qualquer que seja o método) passará primeiro pelo
// "protectRouter" antes de chegar ao controller.
router.use(protectRoute);

// Definição das rotas para o CRUD de produtos

// CRIAR um novo produto (CREATE)
router.post("/", productController.createProduct);

// LER todos os produtos (READ ALL)
router.get("/", productController.getAllProducts);

// LER um único produto por ID (READ ONE)
router.get("/:id", productController.getProductById);

// ATUALIZAR um produto por ID (UPDATE)
router.put("/:id", productController.updateProduct);

// DELETAR um produto por ID (DELETE)
router.delete("/:id", productController.deleteProduct);

export default router;
