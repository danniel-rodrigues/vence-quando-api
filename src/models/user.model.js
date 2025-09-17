import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const User = {
  /**
   * Cria um novo usuário no banco de dados.
   * @param {object} userData { email, password }
   * @returns {Promise<object>} O usuário recém-criado.
   */
  create: async (userData) => {
    return prisma.user.create({
      data: userData,
    });
  },

  /**
   * Busca um usuário pelo seu email.
   * @param {string} email O email do usuário.
   * @returns {Promise<object|null>} O usuário encontrado ou null.
   */
  findByEmail: async (email) => {
    return prisma.user.findUnique({
      where: { email: email },
    });
  },

  /**
   * Deleta um usuário pelo seu ID.
   * @param {number} id O ID do usuário a ser deletado.
   */
  deleteById: async (id) => {
    return prisma.user.delete({
      where: { id: id },
    });
  },
};

export default User;
