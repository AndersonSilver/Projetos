const axios = require("axios");

async function indexacaoNotas() {
  const env = "hml";

  async function getToken() {
    const getAmbientToken = async () => {
      const url = {
        prod: "",
        hml: "https://eu-uat-brazil.apis.allianz.com/v1/push-to-pull/accesstoken?grant_type=client_credentials",
      }[env];
      const Authorization = {
        prod: "",
        hml: "Basic WDd3dU1maDNSbHRHZHltMDdWdUozQXpwRFh1R2kwb0c6U1B3M3o1ckFZS0Fpdk02TA==",
      }[env];
      return {
        url,
        Authorization,
      };
    };
    const ambient = await getAmbientToken();
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ambient.url,
      headers: {
        Authorization: ambient.Authorization,
      },
    };
    return (await axios(config)).data.access_token;
  }

  const token = await getToken();

  async function sendNotasGO(env) {
    const getAmbientNotasGO = async () => {
      const url = {
        prod: "",
        hml: "https://eu-uat-brazil.apis.allianz.com/v1/push-to-pull/clientes/documentos/nota",
      }[env];
      return url;
    };
    const ambientNotasGO = await getAmbientNotasGO();
    let data = JSON.stringify({
      referencia: "20171013972", //cpf do cliente
      texto: "Texto informado pelo técnico.", // nota publica que o agente ira enviar
      tipoDoc: "status-pendencia-aguardando-demais-areas", //nome da tabulação
      titulo: "", //sempre vazio
      usuario: "BRDEPRO0", //usuario logado/id
    });

    let configNotasGO = {
      method: "put",
      maxBodyLength: Infinity,
      url: ambientNotasGO,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };
    return (await axios(configNotasGO)).data;
  }

  const notasGO = await sendNotasGO(env);
  console.log(notasGO);
  return notasGO;
}
