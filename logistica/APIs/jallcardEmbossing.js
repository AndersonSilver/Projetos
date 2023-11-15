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

async function jallcard() {
  const codigoRastreio = ticket.payloadOrigin.embossing.ar;

  const getTokenSensedia = async () => {
    try {
      const config = {
        method: "post",
        url: "https://api-portoseg.sensedia.com/oauth/v2/access-token",
        headers: {
          Authorization:
            "Basic M2Q3YzBjMDktMmM0NS0zNWMwLTljZWYtYTM3OGExNzZiY2U5OjYxODZmMmM3LWIzYmEtM2EwZi1hODc1LWQ1NDU5ODY3ZDZjNQ==",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          grant_type: "client_credentials",
        }),
      };
      const token = (await axios(config)).data.access_token;
      return token;
    } catch (error) {
      throw new Error("Falha ao gerar token Sensedia", error);
    }
  };

  const consutaJallCard = async (codigoRastreio) => {
    try {
      const token = await getTokenSensedia();
      const config = {
        method: "get",
        url: `https://api-portoseg.sensedia.com/pyxis-sp/v1/documentos?codigoPesquisa=${codigoRastreio}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios(config).then((item) => {
        const ret = item.data.length > 0 ? item.data[0] : null;
        return ret;
      });
      if (!response) {
        throw new Error("No data found");
      }
      return response;
    } catch (error) {
      throw new Error("erro api jallcard", error);
    }
  };

  const resultBusca = await consutaJallCard(codigoRastreio);
  const consultaCartaoExpedido = {
    ...resultBusca,
    cartaoExpedido: resultBusca.expedicao ? true : false,
  };
  console.log(consultaCartaoExpedido);
  return consultaCartaoExpedido;
}

jallcard();
