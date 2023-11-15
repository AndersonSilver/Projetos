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
    status: "sem cpf",
  },
};

async function smsBoleto() {
  const telefone = data.result.telefone;

  const configObject = {
    clientId: "3d7c0c09-2c45-35c0-9cef-a378a176bce9",
    clientSecret: "6186f2c7-b3ba-3a0f-a875-d5459867d6c5",
    bitlyToken: "0bdc8115ba79dd55050d4b21772d2e7314c04e91",
  };

  const API_Get_Token_Sensedia = async () => {
    try {
      const authRequest = {
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

      const access_token = (await axios(authRequest)).data.access_token;
      return access_token;
    } catch (err) {
      throw errorFactory("error create token", err);
    }
  };
  const AccecesTokenSensedia = await API_Get_Token_Sensedia();

  const menssagem = {
    destination: telefone,
    messageText: `Porto: Olá! Passando aqui para te lembrar que ainda há uma parcela pendente de pagamento. E, para facilitar a regularização, enviamos um boleto para seu e-mail`,
  };

  const sendMessageViaSMS = async () => {
    try {
      const { data } = await axios({
        method: "post",
        url: "https://api-portoseg.sensedia.com/communication/v1/mkt-send-sms",
        data: {
          destination: menssagem.destination,
          messageText: menssagem.messageText,
        },
        headers: {
          client_id: configObject.clientId,
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccecesTokenSensedia}`,
          access_token: AccecesTokenSensedia,
        },
      });

      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const response = await sendMessageViaSMS();
  console.log({
    response,
    telefone,
    msgSend: menssagem,
  });
  return {
    response,
    telefone,
    msgSend: menssagem,
  };
}
