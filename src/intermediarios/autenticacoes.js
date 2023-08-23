const dados = require("../bancodedados");
const {
  encontrarConta,
  validarCpf,
  validarEmail,
} = require("../controladores/validacoes");

const autenticarBanco = (req, res, next) => {
  const senha = req.query.senha_banco;
  if (!senha) {
    return res.status(400).json({
      mensagem: "O campo senha não pode estar em branco.",
    });
  }
  if (senha !== dados.banco.senha) {
    return res.status(401).json({ mensagem: "Erro: senha inválida." });
  }

  next();
};

const autenticarConta = (req, res, next) => {
  const senha = req.query.senha;
  const conta = encontrarConta(req.query.numero_conta);
  if (conta) {
    if (!senha) {
      return res.status(400).json({
        mensagem: "O campo senha não pode estar em branco.",
      });
    }
    if (senha !== conta.usuario.senha) {
      return res.status(401).json({ mensagem: "Erro: senha inválida." });
    }
  } else {
    return res.status(404).json({ mensagem: "Conta não encontrada" });
  }
  next();
};

const autenticarValoresConta = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos devem ser preenchidos." });
  }
  next();
};

const autenticarValorUnico = (req, res, next) => {
  const { cpf, email } = req.body;
  if (validarCpf(cpf)) {
    return res
      .status(400)
      .json({ mensagem: "O CPF informado já está cadastrado." });
  }
  if (validarEmail(email)) {
    return res
      .status(400)
      .json({ mensagem: "O e-mail informado já está cadastrado." });
  }
  if (!validarCpf(cpf) && cpf.length !== 11) {
    return res
      .status(400)
      .json({ mensagem: "Digite um CPF de tamanho válido." });
  }
  next();
};

module.exports = {
  autenticarBanco,
  autenticarConta,
  autenticarValoresConta,
  autenticarValorUnico,
};
