import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPasswordUser,
  resetPasswordUser,
} from "../controllers/auth.controller.js";

const router = Router();

// Definição das Rotas de autenticação

// Rota para REGISTRAR um novo usuário
router.post("/register", registerUser);

// Rota para LOGAR um usuário existente.
router.post("/login", loginUser);

// Rota para solicitar redefinição de sneha.
router.post("/forgot-password", forgotPasswordUser);

// Rota para redefinir a senha
router.post("/reset-password/:token", resetPasswordUser);

export default router;
