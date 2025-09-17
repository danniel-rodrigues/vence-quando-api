import * as authService from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = await authService.register(email, password);

    res.status(201).json(newUser);
  } catch (error) {
    if (error.message.includes("email já está cadastrado")) {
      return res.status(409).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Erro ao cadastrar usuário.", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);

    // Se o login for bem-sucedido, envia o token de volta para o cliente.
    res.status(200).json({
      message: "Login bem-sucedido!",
      token: token,
    });
  } catch (error) {
    // Se o erro for de "Credenciais inválidas", envia status 401 (Unauthorized).
    if (error.message.includes("Credenciais inválidas")) {
      return res.status(401).json({ message: error.message });
    }

    res.status(500).json({
      message: "Erro ao realizar login.",
      error: error.messae,
    });
  }
};

export const forgotPasswordUser = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    // SEGURANÇA: Sempre envie uma mensagem de sucesso genérica.
    res.status(200).json({
      message:
        "Se um usuário com este email existir, um link para redefinição de senha foi enviado.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao processar a solicitação.",
      error: error.message,
    });
  }
};

export const resetPasswordUser = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "A nova senha é obrigatória." });
    }

    await authService.resetPassword(token, password);

    res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    if (error.message.includes("inválido ou expirado")) {
      return res.status(400).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Erro ao redefinir a senha.", error: error.message });
  }
};
