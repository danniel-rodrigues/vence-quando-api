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
