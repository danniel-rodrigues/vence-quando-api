// O controller é o intermediário entre as rotas (o que o usuário acessa)
// e os serviços (onde a lógica de negócio acontece).
// Sua principal responsabilidade é:
// 1. Receber a requisição (request).
// 2. Extrair dados da requisição (params, query, body).
// 3. Chamar a função de serviço apropriada.
// 4. Enviar a resposta (response) para o cliente com o status HTTP correto.

// Importamos o serviço de produtos, que terá a lógica de negócio e o acesso ao banco.
// AINDA NÃO CRIAMOS ESSE ARQUIVO, mas já vamos deixar a importação pronta.
import * as productService from "../services/product.service.js";

/**
 * Função para CRIAR um novo produto.
 * Será chamada pela rota POST /products
 */
export const createProduct = async (req, res) => {
  // O 'try...catch' é uma forma de garantir que, se qualquer erro acontecer
  // dentro do bloco 'try', o 'catch' será executado e o servidor não vai quebrar.
  try {
    // Obter os dados do body da requisição.
    const { productName, expirationDate } = req.body;

    // Chama o serviço responsável por criar o produto no banco de dados.
    // Usa-se "await" porque a operação com o banco de dados é assíncrona.
    const newProduct = await productService.create(productName, expirationDate);

    // Enviar a resposta para o cliente.
    // O status 201 significa "Created" (Criado), que é o padrão para POST bem-sucedido.
    // Enviar o produto recém criado de volta como confirmação.
    res.status(201).json(newProduct);
  } catch (error) {
    // Se um erro ocorrer, enviamos uma resposta de erro genérica.
    // O status 500 significa "Internal Server Error" (Erro Interno do Servidor).
    res
      .status(500)
      .json({ message: "Erro ao criar o produto.", error: error.message });
  }
};

/**
 * Função para BUSCAR TODOS os produtos.
 * Será chamada pela rota GET /products
 */
export const getAllProducts = async (_, res) => {
  try {
    // Chamar o serviço que busca todos os produtos.
    const products = await productService.findAll();

    // Enviar a lista de produtos com o status "200 OK".
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar produtos.", error: error.message });
  }
};

/**
 * Função para BUSCAR UM produto pelo seu ID.
 * Será chamada pela rota GET /products/:id
 */
export const getProductById = async (req, res) => {
  try {
    // Obter o ID dos parâmetros da URL (ex.: /products/123 -> id = 123).
    const { id } = req.params;

    // Converter o ID para um número inteiro.
    const productId = parseInt(id, 10);

    // Verifica se a conversão resultou em um número válido.
    if (isNaN(productId)) {
      return res
        .status(400)
        .json({ message: "O ID fornecido não é um número válido." });
    }

    // Chamar o serviço que busca o produto específico.
    const product = await productService.findById(productId);

    // Verificação: Se o serviço não encontrar o produto, ele deve retornar null ou undefined.
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    // Se encontrou, enviar o produto com o status "200 OK".
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar produto.", error: error.message });
  }
};

/**
 * Função para ATUALIZAR um produto pelo ID.
 * Será chamada pela rota PUT /products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    // Obter o ID dos parâmetros e os novos dados do body da requisição.
    const { id } = req.params;
    const dataToUpdate = req.body;

    // Converter o ID para um número inteiro.
    const productId = parseInt(id, 10);

    // Verifica se a conversão resultou em um número válido.
    if (isNaN(productId)) {
      return res
        .status(400)
        .json({ message: "O ID fornecido não é um número válido." });
    }

    // Chamar o serviço de atualização.
    const updatedProduct = await productService.update(productId, dataToUpdate);

    // Verificação: Caso o ID não exista para ser atualizado.
    if (!updateProduct) {
      res
        .status(404)
        .json({ message: "Produto não encontrado para atualização." });
    }

    // Caso seja encontrado, enviar o produto já atualizado com o status "200 OK".
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar o produto.", error: error.message });
  }
};

/**
 * Função para DELETAR um produto pelo seu ID.
 * Será chamada pela rota DELETE /product/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    // Obter o ID do produto pelos parâmetros.
    const { id } = req.params;

    // Converter o ID para um número inteiro.
    const productId = parseInt(id, 10);

    // Verifica se a conversão resultou em um número válido.
    if (isNaN(productId)) {
      return res
        .status(400)
        .json({ message: "O ID fornecido não é um número válido." });
    }

    // Chamar o serviço que remove o produto.
    const success = await productService.remove(productId);

    // Verificação: Se o serviço retornar false, significa que não encontrou o produto.
    if (!success) {
      return res
        .status(404)
        .json({ message: "Produto não encontrado para exclusão." });
    }

    // Caso encontrado, enviar a resposta de sucesso.
    // O status 204 significa "No Content" (Sem Conteúdo). É o padrão para DELETE
    // bem-sucedido, indicando que a operação funcionou mas não há nada para enviar de volta.
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao excluir produto.", error: error.message });
  }
};
