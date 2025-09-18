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

// ROTAS PÚBLICAS
// Definição das Rotas de autenticação
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPasswordUser);
router.post("/reset-password/:token", resetPasswordUser);

// ROTAS PRIVADAS
// Usa 'protectRouter' para garantir que o usuário está logado.
router.delete("/account", protectRoute, deleteUserAccount);

export default router;
