const axios = require("axios");
require("dotenv").config();

async function apiTabularTickerts(arrayTabular, tabId, text, privateNote) {
  const login = async () => {
    const getBaseUrl = async () => {
      const url = {
        prod: "https://api-clients.tech4h.com.br/security/user/login",
        qa: "https://qa-api-clients.hml-tech4h.com.br/security/user/login",
        dev: "ttps://api-clients.hml-tech4h.com.br/security/user/login",
      }[ambient];
      return url;
    };
    const dados = await getBaseUrl();

    const getLoginData = async () => {
      return {
        email: process.env.EMAIL_LOGIN,
        password: process.env.SENHA_LOGIN,
        slug: slug,
      };
    };
    const body = JSON.stringify(await getLoginData());

    const authRequest = {
      method: "post",
      url: dados,
      data: body,
    };

    const token = await axios(authRequest);
    return {
      Authorization: token.data.data.Authorization,
      AuthorizationRA: token.data.data.AuthorizationRA,
      AuthorizationRCB: token.data.data.AuthorizationRCB,
      user: {
        id: token.data.data.user.id,
        name: token.data.data.user.name,
      },
      profiles: {
        name: token.data.data.profiles[0].name,
      },
      company: {
        id: token.data.data.company.id,
        name: token.data.data.company.name,
      },
    };
  };

  async function tabulationTickets() {
    const arrayId = arrayTabular;
    const tab_id = tabId;
    const arrayRequest = arrayId.map(({ id }) => tabulationRequest(id, tab_id));
    const arrayResponse = await Promise.allSettled(arrayRequest);

    arrayResponse.forEach((item, i) => {
      if (item.status == "fulfilled") {
        console.info(`Ticket ${i} Tabulado!:`, {
          id: item.value.data.conversationId,
          status: item.value.status,
        });
      } else if (item.status == "rejected") {
        console.info(`Erro ao tabular ticket ${i}`, {
          error: item.reason.response.data.message[0].value,
          status: item.reason.response.status,
        });
      } else {
        console.error("erro desconhecido!");
      }
    });
  }

  async function tabulationRequest(id, tabId) {
    const token = await login();

    const Authorization = token.Authorization;
    const options = {
      method: "POST",
      url: `https://api-messages.tech4h.com.br/tech4h-messages/response/send/realautomation/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: Authorization,
      },
      data: { tabId: `${tabId}`, text: text, privateNote: privateNote },
    };
    return axios.request(options);
  }

  tabulationTickets();
}

module.exports = { apiTabularTickerts };
