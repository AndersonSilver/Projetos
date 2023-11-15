const axios = require("axios");
const ticket = require("./general.json");
const [, , esteira, ar] = process.argv;

async function consultaJallCard() {
  const getCodigoRastreio = async () => {
    if (esteira == "embossing") {
      const codigoRastreio = ar.substring(2);
      return codigoRastreio;
    } else if (esteira == "cartao") {
      const codigoRastreio = `FL0000000${ar}BR`;
      return codigoRastreio;
    }
  };
  const codigoRastreio = await getCodigoRastreio();

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

  const consutaJallCard = async () => {
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

  const resultBusca = await consutaJallCard();
  const consultaCartaoExpedido = {
    ...resultBusca,
    cartaoExpedido: resultBusca.expedicao ? true : false,
  };
  console.log(consultaCartaoExpedido);
  return consultaCartaoExpedido;
}

consultaJallCard();
