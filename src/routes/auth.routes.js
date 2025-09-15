import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";

const router = Router();

// Definição das Rotas de autenticação

// Rota para REGISTRAR um novo usuário
router.post("/register", registerUser);

export default router;
