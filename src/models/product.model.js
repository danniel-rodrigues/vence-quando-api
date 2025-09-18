import { PrismaClient } from "@prisma/client";

// Instanciar o cliente para ter acesso aos modelos.
const prisma = new PrismaClient();

// Cria um objeto que agrupa todas as funções de acesso ao banco para o modelo Product.
const Product = {
  /**
   * Cria um novo produto no banco de dados.
   * @param {object} productData O objeto com { productName, expirationDate, userId }.
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
   * Busca todos os produtos de um usuário no banco de dados.
   * @param {number} userId O ID do usuário ao qual os produtos pertencem.
   * @returns {Promise<Array>} Uma lista de todos os produtos.
   */
  findAll: async (userId) => {
    // Usa o método findMany
    // Já retornar a lista ordenada pela data de validade.
    return prisma.product.findMany({
      where: { userId: userId },
      orderBy: {
        expirationDate: "asc", // asc = ascendente
      },
    });
  },

  /**
   * Busca um produto único pelo se ID, mas também garante que ele pertence ao usuário logado.
   * @param {number} id O ID do produto a ser buscado.
   * @param {number} userId O ID do usuário ao qual o produto pertence.
   * @returns {Promise<object|null>} O produto encontrado ou null se não existir.
   */
  findById: async (id, userId) => {
    // Usa o método findUnique para buscar por um campo único (chave primária @id)
    return prisma.product.findFirst({
      where: { id: id, userId: userId },
    });
  },

  /**
   * Atualiza os dados de um produto existente apenas se o ID e o userId baterem.
   * @param {number} id O ID do produto a ser atualizado.
   * @param {number} userId O ID do usuário ao qual o produto pertence.
   * @param {object} dataToUpdate Objeto com os campos a serem atualizados.
   * @returns {Promise<object>} O objeto do produto com os dados atualizados.
   */
  update: async (id, dataToUpdate, userId) => {
    // 'update', especificando qual registro (WHERE) e o que atualizar (data).
    return prisma.product.updateMany({
      where: { id: id, userId: userId },
      data: dataToUpdate,
    });
  },

  /**
   * Remove um produto do banco de dados apenas quando o ID e o userId baterem.
   * @param {number} id O ID do produto a ser removido.
   * @param {number} userId O ID do usuário ao qual o produto pertence.
   * @returns {Promise<object>} O objeto do produto que foi removido.
   */
  remove: async (id, userId) => {
    // Usa o método delete para remover o produto.
    return prisma.product.deleteMany({
      where: { id: id, userId: userId },
    });
  },
};

export default Product;
