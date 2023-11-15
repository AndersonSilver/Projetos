// console.log(JSON.stringify({"id": "82ffe274-e6fb-4832-bd06-b50fcc30b2c1", "name": "boleto","content": ``}))
const axios = require("axios");
const ticket = require("./general.json");
const fs = require("fs");
const qs = require("qs");
const [, , protocol, tipo, slug, ambient] = process.argv;
const FormData = require("form-data");

const data = {
  result: {
    telefone: "+5535997161655",
    email: "luiz.souza@Ttech4h.com.br",
    openedAt: "2021-07-08T14:00:00.000Z",
    status: "Nenhum dado de pessoa encontrado e email nao informado no ticket",
  },
};

const ticketAutomationFlowBlock = {
  ticketAutomationFlow: {
    automationFlowTrigger: {
      tabId: "9423d02a-6924-4005-aa86-e849ab64f442",
    },
  },
};

async function exec() {
  const nomeCorretor = ticket.payloadOrigin.data.nomeCorretor;
  return {
    nomeCorretor,
    nota: ticket.properties.tab.publicNote || "",
  };
}

exec();
