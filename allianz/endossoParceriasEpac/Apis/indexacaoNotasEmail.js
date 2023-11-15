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
  const cpfCliente = ticket.payloadOrigin.data.informacaoSegurado1.cpf;

  let cpfFormatado = cpfCliente.replace(/\D/g, "");

  const tabs = {
    "endosso-tabulacao-dados-segurado": ["60d46dc5-d4c4-4301-b9cb-b8b5239517d6"], //Dados do segurado
    "endosso-tabulacao-alteração-risco": ["fe78087d-511c-490d-b8e1-e243d4fe2609"], //Alteração do risco
    "endosso-tabulacao-alteração-coberturas": ["7fbb4dcc-9388-477e-839e-910f08fbe6ed"], //Alteração coberturas
    "endosso-tabulacao-alteração-dados-bancarios": ["21bfc16d-9f8f-44f1-8a98-1126f2099391"], //Alteração dados bancários
    "endosso-tabulacao-alteração-dados-condutor": ["f42ca4b1-4705-4d0c-ac60-66f75a3592ed"], //Alteração dados condutor
    "endosso-tabulacao-alteração-cep-risco": ["d46f40df-6a96-4367-8f73-5ec1a6b672d2"], //Alteração CEP de risco
    "endosso-tabulacao-clausula-beneficiaria": ["a429fe85-f433-4ec9-96c4-f1d2fd31bf32"], //Cláusula beneficiária
    "endosso-tabulacao-cancelamento": ["11be8d98-c3ba-41b0-bc9b-0a8126dbaee6"], //Cancelamento
    "endosso-pendencia-nota-cliente": ["db609d61-d01b-46e6-8886-079f3d675564"], //Pendencia corretor
    "endosso-pendencia-nota-envio-cotacao": ["9423d02a-6924-4005-aa86-e849ab64f442"], //Envio de Cotação
    "endosso-nota-conclusao": ["044a5b26-94db-4703-8f75-f95ec7a04bc0"], //Recuza por Prazo
  };

  const tabid = ticketAutomationFlowBlock.ticketAutomationFlow.automationFlowTrigger.tabId;

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
      throw new Error("error token", error);
    }
  }
  const token = await getToken();

  async function indexingNote() {
    try {
      let status = "";

      for (let k in tabs) {
        if (tabs[k].includes(tabid)) {
          status = k;
          break;
        }
      }

      let configIndexingNote = {
        method: "put",
        maxBodyLength: Infinity,
        url: "https://eu-uat-brazil.apis.allianz.com/v1/push-to-pull/clientes/documentos/nota",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
          referencia: cpfFormatado, //cpf do cliente
          texto: data.result || "", // dados email  ""
          tipoDoc: status, // fazer de para tab/status
          titulo: "", //sempre vazio
          usuario: "WORKFLOW", // usuario padrao
        }),
      };
      //return configIndexingNote
      const response = (await axios(configIndexingNote)).data;
      return {
        data,
        response,
      };
    } catch (error) {
      throw new Error("error indexing note", error);
    }
  }

  const result = await indexingNote();
  //console.log(result);
  return result;
}

exec();
