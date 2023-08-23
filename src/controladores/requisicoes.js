const banco = require("../bancodedados");
const { encontrarConta } = require("./validacoes");
let identificador = 1;

const consultarContas = (req, res) => {
  return res.status(200).send(banco.contas);
};

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  let novaConta = {
    numero: identificador.toString(),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };
  banco.contas.push(novaConta);
  identificador++;
  return res.status(201).send(novaConta);
};

const atualizarConta = (req, res) => {
  const id = req.params.numeroConta;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const conta = encontrarConta(id);
  if (!conta) {
    return res
      .status(404)
      .json({ mensagem: "A conta informada não foi encontrada." });
  } else {
    if (nome) {
      conta.usuario.nome = nome.toString();
    }
    if (cpf) {
      if (!isNaN(Number(cpf))) {
        conta.usuario.cpf = cpf.toString();
      } else {
        return res
          .status(400)
          .json({ mensagem: "O CPF não pode conter letras." });
      }
    }
    if (data_nascimento) {
      conta.usuario.data_nascimento = data_nascimento.toString();
    }
    if (telefone) {
      conta.usuario.telefone = telefone.toString();
    }
    if (email) {
      conta.usuario.email = email.toString();
    }
    if (senha) {
      conta.usuario.senha = senha.toString();
    }
    return res.status(200).json({ mensagem: "Conta atualizada com sucesso." });
  }
};

const deletarConta = (req, res) => {
  const id = req.params.numeroConta;
  const conta = encontrarConta(id);
  const iConta = banco.contas.indexOf(conta);
  if (conta) {
    if (conta.saldo === 0) {
      banco.contas.splice(iConta, 1);
      return res.status(200).json({ mensagem: "Conta apagada com sucesso." });
    } else {
      return res.status(400).json({
        mensagem:
          "A conta precisa estar zerada antes de ser apagada, transfira o valor e tente novamente.",
      });
    }
  } else {
    return res
      .status(404)
      .json({ mensagem: "A conta informada não foi encontrada." });
  }
};

const exibirSaldo = (req, res) => {
  const conta = encontrarConta(req.query.numero_conta);
  if (conta) {
    return res.status(200).json({ saldo: conta.saldo });
  }
};

const exibirExtrato = (req, res) => {
  const identificador = req.query.numero_conta;
  const extrato = {
    depositos: banco.depositos.filter(
      (conta) => conta.numero_conta === identificador
    ),
    saques: banco.saques.filter(
      (conta) => conta.numero_conta === identificador
    ),
    transferencias: banco.transferencias.filter(
      (conta) =>
        conta.numero_conta_origem === identificador ||
        conta.numero_conta_destino === identificador
    ),
  };
  return res.status(200).send(extrato);
};

module.exports = {
  consultarContas,
  criarConta,
  atualizarConta,
  deletarConta,
  exibirSaldo,
  exibirExtrato,
};
