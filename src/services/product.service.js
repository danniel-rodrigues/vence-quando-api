// O service é responsável pela LÓGICA DE NEGÓCIO da aplicação.
// Ele é chamado pelo Controller e é o único que deve se comunicar
// com a camada de dados (Model).
//
// Regras de negócio como "a data de validade não pode ser no passado"
// ou "o nome do produto deve ter no mínimo 3 caracteres" FICAM AQUI.

// Importamos o nosso Model de produto, que será a ponte com o banco de dados.
import Product from "../models/product.model.js";

/**
 * Serviço para CRIAR um novo produto.
 * Contém a lógica de validação antes de salvar no banco de dados.
 * @param {string} productName O nome do produto.
 * @param {string} expirationDate A data de validade do produto.
 * @param {number} userId O ID do usuário ao qual o produto pertence.
 * @returns {Promise<object>} O novo produto criado.
 */
export const create = async (productName, expirationDate, userId) => {
  // Validações

  // Garantir que todos os dados necessários foram enviados.
  if (!productName || !expirationDate) {
    // Lança erro que será capturado pelo try..catch do controller.
    throw new Error("Nome e data de validade são obrigatórios.");
  }

  // Garantir que o nome do produto tenha no mínimo 3 caracteres.
  if (productName.length < 3) {
    throw new Error("Nome deve ter no mínimo 3 caracteres.");
  }

  // Garantir que a data de validade NÃO esteja no passado ou
  // que NÃO seja a data atual (hoje).
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const parts = expirationDate.split("-");
  const expirationDateObj = new Date(parts[0], parts[1] - 1, parts[2]);

  // Verificar se a data é válida.
  if (isNaN(expirationDateObj.getTime())) {
    throw new Error("Formato de data de validade inválido.");
  }

  if (expirationDateObj < currentDate) {
    throw new Error("A data de validade não pode ser uma data passada.");
  }

  const productData = {
    productName,
    expirationDate: expirationDateObj,
    userId,
  };

  // Se todas as validações passaram, chamamos o Model para salvar no banco.
  // O Service não sabe COMO o model salva, ele apenas confia que será salvo.
  const newProduct = await Product.create(productData);

  // Retorna o produto recém-criado para o controller.
  return newProduct;
};

/**
 * Serviço par BUSCAR TODOS os produtos de um usuário logado.
 * @param {number} userId O ID do usuário ao qual o produto pertence.
 * @returns {Promise<Array} Uma lista de todos os produtos.
 */
export const findAll = async (userId) => {
  const products = await Product.findAll(userId);
  return products;
};

/**
 * Serviço para BUSCAR UM produto (de um usuário logado) pelo seu ID.
 * @param {number} id O ID do produto a ser buscado.
 * @param {number} userId O ID do usuário ao qual o produto pertence.
 * @returns {Promise<object|null>} O objeto do produto ou null se não for encontrado.
 */
export const findById = async (id, userId) => {
  // Repasamos a chamada para o Model. O Model é quem sabe como buscar pelo ID.
  const product = await Product.findById(id, userId);
  // Se o Model não encontrar, retorna null, e passamos isso para o controller.
  return product;
};

/**
 * Serviço para ATUALIZAR um produto (de um usuário logado) pelo seu ID.
 * @param {number} id O ID do produto a ser atualizado.
 * @param {number} userId O ID do usuário ao qual o produto pertence.
 * @param {object} dataToUpdate Um objeto com os novos dados do produto.
 * @returns {Promise<object|null>} O produto atualizado ou null se não encontrado.
 */
export const update = async (id, dataToUpdate, userId) => {
  // Antes de tentar atualizar, verificar se o produto existe.
  const productExists = await Product.findById(id, userId);
  if (!productExists) {
    // Se não existir, retorna null para o controller saber que não foi encontrado.
    return null;
  }

  // Validações para os novos dados que estão chegando em dataToUpdate.

  // Validação para o campo productName, se ele foi enviado.
  if (dataToUpdate.productName !== undefined) {
    if (
      typeof dataToUpdate.productName !== "string" ||
      dataToUpdate.productName.trim() === ""
    ) {
      // Lançar erro se o nome do produto for enviado mas estiver vazio.
      throw new Error("O nome do produto não pode ser vazio.");
    }
  }

  // Validação para o campo expirationDate, se ele foi enviado.
  if (dataToUpdate.expirationDate) {
    const currentDate = new Date();
    // Usando o construtor de Data para garantir que a string é uma data válida.
    const parts = dataToUpdate.expirationDate.split("-");
    const expirationDateObj = new Date(parts[0], parts[1] - 1, parts[2]);

    // Zerar as horas para manter a comparação apenas dos dias.
    currentDate.setHours(0, 0, 0, 0);

    // Verificamos se a data resultante é válida. Se o usuário enviar "texto-qualquer",
    // o resultado de `new Date()` será "Invalid Date".
    if (isNaN(expirationDateObj.getTime())) {
      throw new Error("Formato da data de validade é inválido.");
    }

    if (expirationDateObj < currentDate) {
      throw new Error("A data de validade não pode ser uma data passada.");
    }

    dataToUpdate.expirationDate = expirationDateObj;
  }

  // Se todas as validações aplicáveis passarem, chama o Model para aplicar a atualização.
  const result = await Product.update(id, dataToUpdate, userId);

  // Se a contagem de atualizações for maior que 0, significa que funcionou.
  if (result.count > 0) {
    // Retornamos o produto com os dados atualizados para o controller.
    return Product.findById(id, userId);
  }

  return null;
};

/**
 * Serviço para DELETAR um produto (de um usuário logado) pelo seu ID.
 * @param {number} id O ID do produto a ser removido.
 * @param {number} userId O ID do usuário ao qual o produto pertence.
 * @returns {Promise<boolean>} True se foi deletado, false se não foi encontrado.
 */
export const remove = async (id, userId) => {
  // Verificar se o produto existe antes de tentar deletar.
  const productExists = await Product.findById(id, userId);
  if (!productExists) {
    // Retorna false para o controller saber que não foi encontrado.
    return false;
  }

  // Se existe, chama o Model para fazer a remoção do banco de dados.
  await Product.remove(id, userId);

  // Retorna true para informar que houve sucesso.
  return true;
};
