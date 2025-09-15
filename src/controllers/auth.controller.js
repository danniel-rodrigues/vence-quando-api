import e from "express";
import * as authService from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = await authService.register(email, password);

    res.status(201).json(newUser);
  } catch (error) {
    if (error.message.includes("email já está cadastrado")) {
      return res.status(409).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Erro ao cadastrar usuário.", error: error.message });
  }
};
