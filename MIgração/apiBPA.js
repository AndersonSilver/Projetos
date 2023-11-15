const axios = require("axios");
const ticket = require("./general.json");
const [, , slug, ambient] = process.argv;
//apiTransactionPayer

async function apiBPA() {
  const errorFactory = (errorName, error, config = null) => {
    const request = config ? `request: ${JSON.stringify(config)}` : "";
    const erro = `${errorName}${request}`;
    const message = `${error.response.statusText}`;
    const stack = `${error.response.data.resultado}`;
    const arrayErrors = `${error.response.data.lista_erros}`;
    return new Error(
      `${erro}\nMessage: ${message}\nStack: ${stack}\nErrors: ${arrayErrors}`
    );
  };

  const getJournei = async () => {
    try {
      const tabs = {
        COMBEM: "ab702378-78f0-40fa-943f-74cfeff877b6",
        QUITADA: "c42d7e58-6a7a-45a9-bfaa-15bd96193f47",
        "EXCLUSAO 1": "db7f1754-668f-4280-be10-25bdf6cc78d6",
        "EXCLUSAO 2": "913deba0-8b7d-44e0-8894-489a46b78d2f",
        PRESTAMISTA: "58c038c8-eef0-4c8f-8543-d8ea5c825a43",
        NORMAL: "818c9e51-65fa-4f3b-af2e-68d5de138804",
        PJ: "845844c7-083a-4ead-bee5-d595b0c11295",
        INCLUSAO: "74034564-653f-470c-94fe-e8c3fc463d89",
      };

      const getUrlJournei = async () => {
        const configJournei = {
          url: "https://forceflow.tech4h.com.br/api/ticket/journey",
          method: "GET",
          maxBodyLength: Infinity,
          params: {
            type: "email",
            protocol: ticket.protocol,
            authentication: ticket.customer.email,
          },
        };
        const chamaAPI = (await axios(configJournei)).data;
        return chamaAPI;
      };

      const journei = await getUrlJournei();

      const getTabId = journei.journey.map((item) => {
        return item.tabId;
      });

      const filteredResponse = [];

      getTabId.forEach((elm) => {
        for (let k in tabs) {
          if (elm === tabs[k]) {
            filteredResponse.push(k);
          }
        }
      });

      if (filteredResponse == "") {
        return "TAB_ID NAO ENCONTRADA";
      } else {
        return filteredResponse[0];
      }
    } catch (error) {
      throw errorFactory("erro ao buscar journei", error);
    }
  };
  try {
    let tipo_de_transferencia = await getJournei();
    let contemplada = ticket.payloadOrigin.data.cota1.is_contemplated;
    let grupo = ticket.payloadOrigin.data.cota1.group;
    let cota = ticket.payloadOrigin.data.cota1.quota;
    let contrato = ticket.payloadOrigin.data.cota1.adhesion_contract_number;

    let cpfCedente =
      ticket.payloadOrigin.data.informacaoConsorciado.infoConsorciadoDocumento;
    var cpfCedenteTratado = cpfCedente.replace(/\D/g, "");
    let nomeCedente =
      ticket.payloadOrigin.data.informacaoConsorciado.infoConsorciadoNome;
    let DDDCedente = ticket.payloadOrigin.data.informacaoConsorciado.DDD;
    let celularCedente =
      ticket.payloadOrigin.data.informacaoConsorciado.infoConsorciadoTelefone;
    let emailCedente =
      ticket.payloadOrigin.data.informacaoConsorciado.infoConsorciadoEmail;

    let cpfCessionario =
      ticket.payloadOrigin.data.informacoesCessionario.documentoCessionario;
    var cpfCessionarioTratado = cpfCessionario.replace(/\D/g, "");
    let nomeCessionario =
      ticket.payloadOrigin.data.informacoesCessionario.nomeCessionario;
    let DDDCessionario =
      ticket.payloadOrigin.data.informacoesCessionario.dddCessionario;
    let celularCessionario =
      ticket.payloadOrigin.data.informacoesCessionario.telefoneCessionario;
    let emailCessionario =
      ticket.payloadOrigin.data.informacoesCessionario.emailCessionario;

    let step = ticketAutomationFlowBlock.id;

    contemplada = contemplada === "Sim" ? true : false;

    const data = JSON.stringify({
      contemplada: contemplada,
      grupo: grupo,
      cota: cota,
      contrato: contrato,
      cpf_cnpj_ced: [cpfCedenteTratado],
      cpf_ced_responsavel: [],
      nome_cedentes: { [cpfCedenteTratado]: nomeCedente },
      ddd_cedentes: { [cpfCedenteTratado]: DDDCedente },
      cell_cedentes: { [cpfCedenteTratado]: celularCedente },
      email_cedentes: { [cpfCedenteTratado]: emailCedente },
      cpf_cnpj_cess: [cpfCessionarioTratado],
      cpf_cess_responsavel: [],
      nome_cessionarios: { [cpfCessionarioTratado]: nomeCessionario },
      ddd_cessionarios: { [cpfCessionarioTratado]: DDDCessionario },
      cell_cessionarios: { [cpfCessionarioTratado]: celularCessionario },
      email_cessionarios: { [cpfCessionarioTratado]: emailCessionario },
      tipo_de_transferencia: tipo_de_transferencia,
      clientId: "c8347909-f2bf-4496-a3da-5637862c7f6d",
      protocol: ticket.protocol,
      stepId: step,
    });

    const config = {
      method: "post",
      url: "http://api-beta.staging.cloud.bpatechnologies.com/684/iniciar_transferencia",
      headers: {
        Authorization:
          "Basic UG9ydG82ODRUcmFuc2ZlcmVuY2lhQ290YXNBUElUNDpRZjJSckpzOUQyUDI3c1ZNMFFoQg==",
        "Content-Type": "application/json",
        Cookie:
          "AWSALB=4JMuYtNiN3BJtr76mfO5m48BW2U0+aWhUaOZZAaNKIzvxfFOyGgDPOGfVH5zNmSR1RZuLQEFOZ/GsEBZM7bg7wRIBvvQ2tIa71CohnmksriRuIAnXksYMLJ0HDMY; AWSALBCORS=4JMuYtNiN3BJtr76mfO5m48BW2U0+aWhUaOZZAaNKIzvxfFOyGgDPOGfVH5zNmSR1RZuLQEFOZ/GsEBZM7bg7wRIBvvQ2tIa71CohnmksriRuIAnXksYMLJ0HDMY",
      },
      data: data,
    };

    const chamaApi = (await axios(config)).data;
    console.log(chamaApi);
    return chamaApi;
  } catch (error) {
    throw errorFactory("error api BPA", error);
  }

}

apiBPA();
