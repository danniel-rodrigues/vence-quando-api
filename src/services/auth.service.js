import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

/**
 * Serviço para registrar um novo usuário ao banco de dados.
 * @param {string} email O email do usuário.
 * @param {string} password A senha do usuário.
 * @returns {Promise<object>} O novo usuário criado.
 */
export const register = async (email, password) => {
  // Verificar se o email já está em uso.
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new Error("Este email já está cadastrado.");
  }

  // Aplicar o hash na senha antes de salvar
  // O número 10 é o "custo" do hash.
  const newPassword = await bcrypt.hash(password, 10);

  // Chamar o model para criar o usuário com a senha hasheada.
  const newUser = await User.create({
    email,
    password: newPassword,
  });

  // Remover a senha do objeto antes de retorná-lo.
  delete newUser.password;

  return newUser;
};
