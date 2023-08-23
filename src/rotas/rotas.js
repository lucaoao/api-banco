const express = require("express");
const rotas = express.Router();
const {
  autenticarBanco,
  autenticarConta,
  autenticarValorUnico,
  autenticarValoresConta,
} = require("../intermediarios/autenticacoes");

const {
  consultarContas,
  criarConta,
  atualizarConta,
  deletarConta,
  exibirSaldo,
  exibirExtrato,
} = require("../controladores/requisicoes");

const {
  depositarValor,
  sacarValor,
  transferirValor,
} = require("../controladores/transacoes");

rotas.get("/contas", autenticarBanco, consultarContas);
rotas.post("/contas", autenticarValoresConta, autenticarValorUnico, criarConta);
rotas.put("/contas/:numeroConta/usuario", autenticarValorUnico, atualizarConta);
rotas.delete("/contas/:numeroConta", deletarConta);
rotas.get("/contas/saldo", autenticarConta, exibirSaldo);
rotas.get("/contas/extrato", autenticarConta, exibirExtrato);

rotas.post("/transacoes/depositar", depositarValor);
rotas.post("/transacoes/sacar", sacarValor);
rotas.post("/transacoes/transferir", transferirValor);

module.exports = rotas;
