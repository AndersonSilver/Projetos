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

async function indexacaoNotas() {
  const cpfCliente = ticket.payloadOrigin.data.informacaoSegurado1.cpf;

  let cpfFormatado = cpfCliente.replace(/\D/g, "");

  async function getToken() {
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://eu-uat-brazil.apis.allianz.com/v1/push-to-pull/accesstoken?grant_type=client_credentials",
        headers: {
          Authorization: "Basic WDd3dU1maDNSbHRHZHltMDdWdUozQXpwRFh1R2kwb0c6U1B3M3o1ckFZS0Fpdk02TA==",
        },
      };
      return (await axios(config)).data.access_token;
    } catch (error) {
      throw new Error("error", error);
    }
  }

  const token = await getToken();

  async function sendNotasGO() {
    try {
      let data = JSON.stringify({
        referencia: cpfFormatado, //cpf do cliente
        texto: ticket.properties.tab.publicNote || "", // nota publica que o agente ira enviar
        tipoDoc: "endosso-pendencia-nota-aguardando-ti", // fazer de para tab/status
        titulo: "", //sempre vazio
        usuario: "WORKFLOW", // usuario padrao
      });

      let configNotasGO = {
        method: "put",
        maxBodyLength: Infinity,
        url: "https://eu-uat-brazil.apis.allianz.com/v1/push-to-pull/clientes/documentos/nota",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };
      const result = (await axios(configNotasGO)).data;
      return {
        data,
        result,
      };
    } catch (error) {
      throw new Error("error", error);
    }
  }

  const notasGO = await sendNotasGO();
  //console.log(notasGO);
  return notasGO;
}

indexacaoNotas();
