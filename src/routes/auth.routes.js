import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPasswordUser,
  resetPasswordUser,
  deleteUserAccount,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

// Rotas públicas
// Definição das Rotas de autenticação

// Rota para REGISTRAR um novo usuário
router.post("/register", registerUser);

// Rota para LOGAR um usuário existente.
router.post("/login", loginUser);

// Rota para solicitar redefinição de sneha.
router.post("/forgot-password", forgotPasswordUser);

// Rota para redefinir a senha
router.post("/reset-password/:token", resetPasswordUser);

// Rota privada para deletar a conta
// Usa 'protectRouter' para garantir que o usuário está logado.
router.delete("/account", protectRoute, deleteUserAccount);

export default router;
