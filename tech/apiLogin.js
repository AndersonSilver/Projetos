const axios = require("axios");
require("dotenv").config();
const [, , slug, ambient] = process.argv;

async function login() {
  const getBaseUrl = async () => {
    const url = {
      prod: "https://api-clients.tech4h.com.br/security/user/login",
      qa: "https://qa-api-clients.hml-tech4h.com.br/security/user/login",
      dev: "ttps://api-clients.hml-tech4h.com.br/security/user/login",
    }[ambient];
    return url;
  };

  const getLoginData = async () => {
    return {
      email: process.env.EMAIL_LOGIN,
      password: process.env.SENHA_LOGIN,
      slug: slug, //process.env.SLUG_LOGIN
    };
  };

  const dados = await getBaseUrl();

  const body = JSON.stringify(await getLoginData());

  const authRequest = {
    method: "post",
    url: dados,
    data: body,
  };

  const token = await axios(authRequest);
  console.log({
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
  });
  return token.data.data;
}

login();

module.exports = { login };
