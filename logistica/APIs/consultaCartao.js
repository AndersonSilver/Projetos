const axios = require("axios");
const ticket = require("../../tech/general.json");
const fs = require("fs");
const qs = require("qs");
const [, , protocol, tipo, slug, ambient] = process.argv;
const FormData = require("form-data");
const { get } = require("http");

const data = {
  result: {
    telefone: "+5535997161655",
    email: "luiz.souza@Ttech4h.com.br",
    openedAt: "2021-07-08T14:00:00.000Z",
    status: "sem cpf",
  },
};

const ticketAutomationFlowBlock = {
  ticketAutomationFlow: {
    automationFlowTrigger: {
      tabId: "0e4f46e4-77f4-46f6-a5ab-12a77945934c",
    },
  },
};

async function testeApis() {
  const codigoRastreio = `FL0000000${ticket.payloadOrigin.data.idCartao}BR`;
  const getToken = async () => {
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://portoapicloud.portoseguro.com.br/oauth/v2/access-token",
        headers: {
          Authorization:
            "Basic M2Q3YzBjMDktMmM0NS0zNWMwLTljZWYtYTM3OGExNzZiY2U5OjYxODZmMmM3LWIzYmEtM2EwZi1hODc1LWQ1NDU5ODY3ZDZjNQ==",
        },
        data: {
          grant_type: "client_credentials",
        },
      };
      const token = await axios(config);
      return token.data.access_token;
    } catch (err) {
      throw new Error("error create token", err);
    }
  };
  const token = await getToken();
  const getEncomenda = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://portoapicloud.portoseguro.com.br/logistica/tag/v1/flash/encomendas/${codigoRastreio}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = (await axios(config)).data;
    return response;
  };
  const response = await getEncomenda();
  if (!response) {
    throw new Error("Produto não expedido!");
  } else {
    const result = response.hawbs[0].historico.reverse()[0];
    console.log(result);
    return result;
  }
}
