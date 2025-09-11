// O Model é a camada de acesso a dados (Data Access Layer).
// Com o Prisma, sua única responsabilidade é importar o Prisma Client
// e expor funções que executam os métodos do Prisma (create, find, update, delete).
// Ele não contém lógica de negócio, apenas a comunicação com o banco.

import { PrismaClient } from "@prisma/client";

// Instanciar o cliente para ter acesso aos modelos.
const prisma = new PrismaClient();

// Cria um objeto que agrupa todas as funções de acesso ao banco para o modelo Product.
const Product = {
  /**
   * Cria um novo produto no banco de dados.
   * @param {object} productData O objeto com { productName, expirationDate }.
   * @returns {Promise<object>} O objeto do produto recém-criado.
   */
  create: async (productData) => {
    // Usamos o método 'create' do Prisma. O Prisma garante que apenas os
    // campos definidos no schema.prisma sejam inseridos.
    return prisma.product.create({
      data: productData,
    });
  },

  /**
   * Busca todos os produtos no banco de dados.
   * @returns {Promise<Array>} Uma lista de todos os produtos.
   */
  findAll: async () => {
    // Usa o método findMany
    // Já retornar a lista ordenada pela data de validade.
    return prisma.product.findMany({
      orderBy: {
        expirationDate: "asc", // asc = ascendente
      },
    });
  },

  /**
   * Busca um produto único pelo se ID.
   * @param {number} id O ID do produto a ser buscado.
   * @returns {Promise<object|null>} O produto encontrado ou null se não existir.
   */
  findById: async (id) => {
    // Usa o método findUnique para buscar por um campo único (chave primária @id)
    return prisma.product.findUnique({
      where: { id: id },
    });
  },

  /**
   * Atualiza os dados de um produto existente.
   * @param {number} id O ID do produto a ser atualizado.
   * @param {object} dataToUpdate Objeto com os campos a serem atualizados.
   * @returns {Promise<object>} O objeto do produto com os dados atualizados.
   */
  update: async (id, dataToUpdate) => {
    // 'update', especificando qual registro (WHERE) e o que atualizar (data).
    return prisma.product.update({
      where: { id: id },
      data: dataToUpdate,
    });
  },

  /**
   * Remove um produto do banco de dados.
   * @param {number} id O ID do produto a ser removido.
   * @returns {Promise<object>} O objeto do produto que foi removido.
   */
  remove: async (id) => {
    // Usa o método delete para remover o produto.
    return prisma.product.delete({
      where: { id: id },
    });
  },
};

export default Product;
