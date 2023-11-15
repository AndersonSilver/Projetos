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
      tabId: "a83e2d01-3967-4406-9572-fc841a5c6628",
    },
  },
};

async function exec() {

  const getTokens = async () => {
    try {
      let dataLogin = JSON.stringify({
        login: "automacao@tech4h.com.br",
        password: "eHqNg:)+hTuFgd1f",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://webapp-qa-api.hml-tech4h.com.br/allianz/corretores/authentication/access-session/password",
        headers: {
          "Content-Type": "application/json",
        },
        data: dataLogin,
      };

      const response = await axios(config);
      return response.data.access_token;
    } catch (error) {
      throw new Error("Erro Login", error);
    }
  };

  const token = await getTokens();

  // acesso token
  //---------------------------------------------------------------------

  const createProtocol = async () => {
  try {
    let dataLoginWepApp = JSON.stringify({
      protocol: `${ticket.protocol}`,
      workflow_id: "42b4e6a9-461a-4a90-9482-71c7a0e99250",
      status: "awaiting_evaluation",
      agree_terms: true,
      external_identifications: {susep: ticket.payloadOrigin.data.dadosCorretor.susepCorretor},
      user_requested_already_viewed_protocol: true,
      products: {},
      main_user_account: {
        name: ticket.payloadOrigin.data.dadosPrestador.nomePrestador,
        email: ticket.payloadOrigin.data.dadosPrestador.emailPrestador,
        social_number: ticket.payloadOrigin.data.dadosPrestador.nifPrestador,
        phone_number: ticket.payloadOrigin.data.dadosPrestador.telefonePrestador,
      },
    });

    let configLoginWebApp = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://webapp-qa-api.hml-tech4h.com.br/allianz/corretores/techforms/workflow-protocol",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: dataLoginWepApp,
    };

    const response = await axios(configLoginWebApp);

    const result = {
      protocolId: response.data.id,
      interactionId: response.data.workflow_protocol_interactions[0].id,
    };
    
    return result;

  } catch (error) {
    throw new Error("Erro Abertura Solicitação", error);
  }

}
  const ticketCreate = await createProtocol();

  const dadosProposta = async () => {

        try {
          let dataDadosProposta = JSON.stringify({
            workflow_form_id: "8549da15-2198-4ea0-9ee6-57ef039fb1ef",
            workflow_step_id: "1eabb486-946d-4bc0-946a-ab465ba34f9d",
            responses: {
              idRamo: ticket.payloadOrigin.data.dadosProposta.idRamo,
              idProposta: ticket.payloadOrigin.data.dadosProposta.idProposta,
              dataProposta: ticket.payloadOrigin.data.dadosProposta.dataProposta,
              tipoCorretor: ticket.payloadOrigin.data.dadosProposta.tipoCorretor,
              quantidadeItens: ticket.payloadOrigin.data.dadosProposta.quantidadeItens,
              quantidadeBloqueios: ticket.payloadOrigin.data.dadosProposta.quantidadeBloqueios,

            },
          });

          let configDadosProposta = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://webapp-qa-api.hml-tech4h.com.br/allianz/corretores/techforms/workflow-protocol/${ticketCreate.protocolId}/workflow-protocol-interaction/${ticketCreate.interactionId}/workflow-protocol-interaction-form-response`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            data: dataDadosProposta,
          };

          const resultDadosProposta = await axios(configDadosProposta);
          return resultDadosProposta.data;
        } catch (error) {
         // throw new Error("Dados Proposta", error);
         console.log(error);
        }
  }

const dadosPropostaId = await dadosProposta();
console.log(dadosPropostaId);

/*
    const statusInteraction = async () => {
    let data = JSON.stringify({
      status: "awaiting_evaluation",
      commentary: "",
      rating: 5,
    });

    try {
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `https://webapp-qa-api.hml-tech4h.com.br/allianz/corretores/techforms/workflow-protocol/${ticketCreate.protocolId}/workflow-protocol-interaction/${ticketCreate.interactionId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      const StatusInteraction = await axios(config);
      const statusInteraction = StatusInteraction.data.status;

      return statusInteraction;

    } catch (error) {
      throw new error("Erro status interaction", error);
    }
  };

  const interactionResult = await statusInteraction();
  */

}

exec();