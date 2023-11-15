const axios = require("axios");
const ticket = require("./general.json");
const fs = require("fs");
const qs = require("qs");
const [, , protocol, tipo, slug, ambient] = process.argv;
const FormData = require("form-data");
const data = {
  result: {
    telefone: "35997161655",
    email: "luiz.souza@Ttech4h.com.br",
  },
};

async function resgistrarAtividade() {
  const protocol = ticket.protocol;
  const createdAt = ticket.createdAt;
  const cpf = ticket.customer.document;
  const status = data.result.status;
  const env = ticket.payloadOrigin.data.campo01;

  const dadosEnviados = {
    atividade: status,
    protocol,
    createdAt,
    cpf,
  };

  const getAmbient = async () => {
    const urlToken = {
      prod: "https://portoapicloud.portoseguro.com.br/oauth/v2/access-token",
      hml: "https://portoapicloud-hml.portoseguro.com.br/oauth/v2/access-token",
      dev: "https://portoapicloud-dev.portoseguro.com.br/oauth/v2/access-token",
    }[env];
    const Authorization = {
      prod: "Basic OTUzOGRiN2MtYjg0OS00NmZkLWIwMTgtYmNlMDA5Mzc3M2RlOjU1MTJhZDM1LWRiNzUtNGZiNC05ZTQ1LWIzZDMzZTkxNTE3MA==",
      hml: "Basic Y2VjYmRkOTMtNDNkYy00MTk5LWI0ZWYtMjc5YTg1NjdjMTY3OmY0OGExYTUxLTgyMjctNGE4My05NmUzLTExZmUyZGFkYWRlMA==",
      dev: "Basic Y2VjYmRkOTMtNDNkYy00MTk5LWI0ZWYtMjc5YTg1NjdjMTY3OmY0OGExYTUxLTgyMjctNGE4My05NmUzLTExZmUyZGFkYWRlMA==",
    }[env];
    const urlWebhook = {
      prod: "https://portoapicloud.portoseguro.com.br/meios-pagamento/porto-pag/registro-comunicacao/v1/registrar-atividade",
      hml: "https://portoapicloud-hml.portoseguro.com.br/meios-pagamento/porto-pag/registro-comunicacao/v1/registrar-atividade",
      dev: "https://portoapicloud-dev.portoseguro.com.br/meios-pagamento/porto-pag/registro-comunicacao/v1/registrar-atividade",
    }[env];
    return {
      urlToken,
      urlWebhook,
      Authorization,
    };
  };
  const ambient = await getAmbient();

  const getTokenWebhook = async () => {
    try {
      const authRequest = {
        method: "post",
        url: ambient.urlToken,
        headers: {
          Authorization: ambient.Authorization,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          grant_type: "client_credentials",
        }),
      };
      const token = (await axios(authRequest)).data.access_token;
      return token;
    } catch (err) {
      throw new Error("error create token", err);
    }
  };

  const registraDados = async () => {
    const token = await getTokenWebhook();

    const config = {
      method: "post",
      url: ambient.urlWebhook,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: dadosEnviados,
    };

    try {
      const response = (await axios(config)).data;
      return response;
    } catch (err) {
      throw new Error("error creating activity", err);
    }
  };
  const response = await registraDados();
  console.log({
    response,
    dadosEnviados,
  });
  return {
    response,
    dadosEnviados,
  };
}
