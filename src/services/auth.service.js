import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemalier from "nodemailer";
import crypto from "crypto";
import User from "../models/user.model.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

/**
 * Serviço para iniciar o processo de redefinição de senha.
 * @param {string} email O email do usuário.
 */
export const forgotPassword = async (email) => {
  const user = await User.findByEmail(email);

  // 2. [SEGURANÇA] Se o usuário NÃO for encontrado, nós NÃO retornamos um erro.
  // Apenas retornamos sucesso silenciosamente. Isso impede que um atacante
  // use esta funcionalidade para descobrir quais emails estão cadastrados no sistema.
  if (!user) {
    return;
  }

  // Gerar um token de redefinição aleatório e seguro.
  const resetToken = crypto.randomBytes(32).toString("hex");

  // "Hashear" o token antes de salvar no banco de dados, por segurança.
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Definir a data de expiração do token (ex.: 10 minutos a partir de agora).
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  // Salvar o token hasheado e a data de expiração no registro do usuário.
  // Precisamos de uma nova função no user.model para isso.
  await prisma.user.update({
    where: { email: email },
    data: {
      passwordResetToken: passwordResetToken,
      passwordResetExpires: passwordResetExpires,
    },
  });

  // Criar a URL de redefinição que será enviada no email.
  // Em produção, seria "https://site.com/reset-password/TOKEN".
  const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

  // Configurar e enviar o email com o Nodemailer.
  const message = `
    <h1>Você solicitou uma redefinição de senha</h1>
    <p>Clique neste <a href="${resetURL}">link</a> para definir uma nova senha.</p>
    <p>Este link irá expirar em 10 minutos.</p>
  `;

  // Configurar o carteiro (transporter) do Nodemailer.
  const transporter = nodemalier.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Enviar o email
  await transporter.sendMail({
    from: '"Vence Quando?" <noreply@vencequando.com>',
    to: user.email,
    subject: "Refefinição de senha",
    html: message,
  });

  // Fim! O resto do processo acontece quando o usuário clica no link.
  return;
};

/**
 * Serviço para finalizar a redefinição de senha.
 * @param {string} token O token de redefinição (vindo do URL).
 * @param {string} newPassword A nova senha do usuário.
 */
export const resetPassword = async (token, newPassword) => {
  // "Hashear" o token recebido pela URL para compará-lo com
  // a versão hasheada que está no banco de dados.
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Encontrar o usuário que possui esse token E cujo token ainda não expirou.
  // Usar "findFirst" porque "passwordResetToken" é um campo único.
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        // 'gte' significa "greater than or equal to" (maior ou igual a).
        // A data de expiração deve ser maior que a data/hora atual.
        gte: new Date(),
      },
    },
  });

  // Se nenhum usuário é econtrado, o token é inválido ou já expirou.
  if (!user) {
    throw new Error("Token inválido ou expirado.");
  }

  // Se o token for válido, "hashear" a nova senha.
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Atualizar a senha do usuário no banco de dados.
  // IMPORTANTE - Também limpar os campos de redefinição de senha
  // para que o token não possa ser reutilizado.
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  // Não é necessário retornar nada, o sucesso da operação é suficiente.
  return;
};
