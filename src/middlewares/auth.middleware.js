import jwt from "jsonwebtoken";

/**
 * Middleware para verificar rotas, verificando a validade de um token JWT.
 */
export const protectRoute = (req, res, next) => {
  // Pegar o token do cabeçalho da requisição.
  // O padrão é o frontend enviar o token no formato "Bearer <token>".
  const authHeader = req.headers.authorization;

  // Verificar se o cabeçalho de autorização existe.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Se não exisitir, o acesso é negado. 401 = Unauthorized.
    return res.status(401).json({
      message: "Acesso negado. Nenhum token fornecido.",
    });
  }

  // Separar a palavra "Bearer" do token em si.
  const token = authHeader.split(" ")[1];

  try {
    // Verificar se o token é valido usando a chave secreta.
    // O JWT faz duas coisas:
    //  a) Verifica a assinatura do token com a JWT_SECRET.
    //  b) Verifica se o token não expirou.
    // Se qualquer uma dessas validações falhar, ele lança um erro.
    const decodePayload = jwt.verify(token, process.env.JWT_SECRET);

    // Se o token for válido, o "decodePayload" conterá os dados que
    // foram guardados nele durante o login (id, email).
    // Agora, anexamos esses dados ao objeto "request" (req).
    req.user = decodePayload;

    // Chamar a função "next" para permitir que a requisição continue
    // seu caminho e chegue ao próximo middleware ou controller final.
    next();
  } catch (error) {
    // Se o jwt.verify lançar um erro (token inválido, expirado, etc.),
    // será capturado aqui.
    return res.status(401).json({
      message: "Acesso negado. Token inválido ou expirado.",
      error: error.message,
    });
  }
};
