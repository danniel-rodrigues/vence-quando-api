// O service é responsável pela LÓGICA DE NEGÓCIO da aplicação.
// Ele é chamado pelo Controller e é o único que deve se comunicar
// com a camada de dados (Model).
//
// Regras de negócio como "a data de validade não pode ser no passado"
// ou "o nome do produto deve ter no mínimo 3 caracteres" FICAM AQUI.

// Importamos o nosso Model de produto, que será a ponte com o banco de dados.
// AINDA NÃO CRIAMOS ESSE ARQUIVO, mas já deixamos a importação pronta.
import Product from "../models/product.model.js";

/**
 * Serviço para CRIAR um novo produto.
 * Contém a lógica de validação antes de salvar no banco de dados.
 * @param {string} productName O nome do produto.
 * @param {string} expirationDate A data de validade do produto.
 * @returns {Promise<object>} O novo produto criado.
 */
export const create = async (productName, expirationDate) => {
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
  const currenteDate = new Date();
  currenteDate.setHours(0, 0, 0, 0);

  const parts = expirationDate.split("-");
  const expirationDateObj = new Date(parts[0], parts[1] - 1, parts[2]);

  // Verificar se a data é válida.
  if (expirationDateObj.getTime()) {
    throw new Error("Formato de data de validade inválido.");
  }

  if (expirationDateObj < currenteDate) {
    throw new Error("A data de validade não pode ser uma data passada.");
  }

  // Se todas as validações passaram, chamamos o Model para salvar no banco.
  // O Service não sabe COMO o model salva, ele apenas confia que será salvo.
  const newProduct = await Product.create({
    productName,
    expirationDate: expirationDateObj,
  });

  // Retorna o produto recém-criado para o controller.
  return newProduct;
};

/**
 * Serviço par BUSCAR TODOS os produtos.
 * @returns {Promise<Array} Uma lista de todos os produtos.
 */
export const findAll = async () => {
  const products = await Product.findAll();
  return products;
};

/**
 * Serviço para BUSCAR UM produto pelo seu ID.
 * @param {string} id O ID do produto a ser buscado.
 * @returns {Promise<object|null>} O objeto do produto ou null se não for encontrado.
 */
export const findById = async (id) => {
  // Repasamos a chamada para o Model. O Model é quem sabe como buscar pelo ID.
  const product = await Product.findById(id);
  // Se o Model não encontrar, retorna null, e passamos isso para o controller.
  return product;
};

/**
 * Serviço para ATUALIZAR um produto pelo seu ID.
 * @param {string} id O ID do produto a ser atualizado.
 * @param {object} dataToUpdate Um objeto com os novos dados do produto.
 * @returns {Promise<object|null>} O produto atualizado ou null se não encontrado.
 */
export const update = async (id, dataToUpdate) => {
  // Antes de tentar atualizar, verificar se o produto existe.
  const productExists = await Product.findById(id);
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
  const updatedProduct = await Product.update(id, dataToUpdate);
  return updatedProduct;
};

/**
 * Serviço para DELETAR um produto pelo seu ID.
 * @param {string} id O ID do produto a ser removido.
 * @returns {Promise<boolean>} True se foi deletado, false se não foi encontrado.
 */
export const remove = async (id) => {
  // Verificar se o produto existe antes de tentar deletar.
  const productExists = Product.findById(id);
  if (!productExists) {
    // Retorna false para o controller saber que não foi encontrado.
    return false;
  }

  // Se existe, chama o Model para fazer a remoção do banco de dados.
  await Product.remove(id);

  // Retorna true para informar que houve sucesso.
  return true;
};
