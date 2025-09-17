import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = Router();

// Definição das Rotas de autenticação

// Rota para REGISTRAR um novo usuário
router.post("/register", registerUser);

// Rota para LOGAR um usuário existente.
router.post("/login", loginUser);

export default router;
