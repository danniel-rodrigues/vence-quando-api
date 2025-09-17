import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

/**
 * Serviço para autenticar um usuário (login).
 * @param {string} email O email do usuário.
 * @param {string} password A senha do usuário.
 * @returns {Promise<string>} O token JWT de acesso.
 */
export const login = async (email, password) => {
  // Encontrar usuário pelo email.
  const user = await User.findByEmail(email);
  if (!user) {
    throw new Error("Credenciais inválidas!");
  }

  // Comparar a senha enviada com a senha hasheada no banco de dados.
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Credenciais inválidas!");
  }

  // Se as credenciais estiverem corretas, gerar o token JWT
  // O "payload" do token é a informação que queremos guardar dentro dele.
  // Guardar o id do usuário é o mais comum e útil.
  const payload = {
    id: user.id,
    email: user.email,
  };

  // Assinar o token com a chave secreta do .env
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};
