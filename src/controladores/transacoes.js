const { encontrarConta, salvarHistorico } = require("./validacoes");

const depositarValor = (req, res) => {
  const { numero_conta, valor } = req.body;
  const conta = encontrarConta(numero_conta.toString());
  if (conta) {
    conta.saldo += Number(valor);
    salvarHistorico("deposito", conta.numero, valor);
    return res
      .status(200)
      .json({ mensagem: "Depósito realizado com sucesso." });
  } else {
    return res.status(404).json({ mensagem: "Conta não encontrada" });
  }
};

const sacarValor = (req, res) => {
  const { numero_conta, valor, senha } = req.body;
  const conta = encontrarConta(numero_conta.toString());
  if (conta) {
    if (!senha || conta.usuario.senha !== senha.toString()) {
      return res
        .status(401)
        .json({ mensagem: "Senha incorreta ou em branco." });
    } else {
      if (conta.saldo >= Number(valor)) {
        conta.saldo -= Number(valor);
        salvarHistorico("saque", conta.numero, valor);
        return res
          .status(200)
          .json({ mensagem: "Saque realizado com sucesso." });
      } else {
        return res
          .status(400)
          .json({ mensagem: "Saldo insuficiente para saque." });
      }
    }
  } else {
    return res.status(404).json({ mensagem: "Conta não encontrada" });
  }
};

const transferirValor = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  const contaEnvio = encontrarConta(numero_conta_origem.toString());
  const contaReceber = encontrarConta(numero_conta_destino.toString());
  if (contaEnvio && contaReceber) {
    if (!senha || contaEnvio.usuario.senha !== senha.toString()) {
      res.status(401).json({ mensagem: "Senha incorreta ou em branco." });
    } else {
      if (contaEnvio.saldo >= Number(valor)) {
        contaEnvio.saldo -= Number(valor);
        contaReceber.saldo += Number(valor);
        salvarHistorico(
          "transferencia",
          contaReceber.numero,
          valor,
          contaEnvio.numero
        );
        res
          .status(200)
          .json({ mensagem: "Transferência efetuada com sucesso." });
      } else {
        return res
          .status(400)
          .json({ mensagem: "Saldo insuficiente para transferência." });
      }
    }
  } else {
    return res.status(404).json({
      mensagem: "Erro: Uma ou mais das contas informadas não existem",
    });
  }
};

module.exports = { depositarValor, sacarValor, transferirValor };
