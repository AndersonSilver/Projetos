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
  async function getToken() {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://eu-uat-brazil.apis.allianz.com/v1/push-to-pull/accesstoken?grant_type=client_credentials",
      headers: {
        Authorization: "Basic WDd3dU1maDNSbHRHZHltMDdWdUozQXpwRFh1R2kwb0c6U1B3M3o1ckFZS0Fpdk02TA==",
      },
    };
    return (await axios(config)).data.access_token;
  }

  const cpfCliente = ticket.payloadOrigin.data.informacaoSegurado1.cpf;

  let cpfFormatado = cpfCliente.replace(/\D/g, "");

  let tipoDoc;
  switch (ticket.payloadOrigin.data.grupo.grupo) {
    case "massificados":
      tipoDoc = "endosso-parceria-imagem-massificados";
      break;
    case "auto":
      tipoDoc = "endosso-parceria-imagem-auto";
      break;
  }

  const token = await getToken();
  return await Promise.all(
    ticket.properties.tab.attachments.map(async (attachment) => {
      const response = await axios.post(
        "https://eu-uat-brazil.apis.allianz.com/v1/push-to-pull/backoffice/v2/documentos/tipo-doc",
        {
          documento: await axios.get(attachment.file.url, { responseType: "stream" }).then((response) => response.data),
          referencia: cpfFormatado,
          tipoDoc: tipoDoc,
          titulo: "",
          usuario: "WORKFLOW",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    }),
  );
}

exec();
