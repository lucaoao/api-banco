const banco = require("../bancodedados");
const { format } = require("date-fns");

function encontrarConta(id) {
  const contaEncontrada = banco.contas.find((conta) => {
    return conta.numero === id;
  });
  return contaEncontrada;
}

function validarCpf(cpf) {
  const cpfValidado = banco.contas.find((conta) => {
    return conta.usuario.cpf === cpf;
  });
  return cpfValidado;
}

function validarEmail(email) {
  const emailValidado = banco.contas.find((conta) => {
    return conta.usuario.email === email;
  });
  return emailValidado;
}

function salvarHistorico(transacao, contaDestino, valor, contaOrigem) {
  let data = new Date();
  data = format(data, "yyyy-MM-dd HH:mm:ss");
  switch (transacao) {
    case "deposito":
      let depositoFeito = {
        data,
        numero_conta: contaDestino,
        valor,
      };
      banco.depositos.push(depositoFeito);
      break;
    case "saque":
      let saqueFeito = {
        data,
        numero_conta: contaDestino,
        valor,
      };
      banco.saques.push(saqueFeito);
      break;
    case "transferencia":
      let transferenciaFeita = {
        data,
        numero_conta_origem: contaOrigem,
        numero_conta_destino: contaDestino,
        valor,
      };
      banco.transferencias.push(transferenciaFeita);
      break;
  }
}

module.exports = {
  validarCpf,
  validarEmail,
  encontrarConta,
  salvarHistorico,
};
