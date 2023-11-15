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

async function apiBackIntegrated() {
  /*   const tabs = {
    "Cartão em Produção": "3eb3b03b-b3b2-4600-9347-bf3b6c8ddafe",
    "Logística Iniciada Malha": "40639855-99c8-48bd-bfe3-a157d65a9d48",
    "Logística Iniciada Correios": "da897623-1424-44b9-a638-918bdafe7bb6",
    "Saiu para Entrega": "b73a6fdc-2c33-4ceb-b750-6fbb35a59bd2",
    "A Caminho": "944d7c67-33ca-4dd7-be01-530b3a166c1f",
    "Encomenda Danificada": "96155c4e-7bec-47a9-914b-892ee1214d12",
    "Sinistro": "aa490668-0311-46ac-ab0e-5358d8f224ee",
    "Greve/Recesso": "da6f5a97-5a94-4ebd-b3f4-c256f410b8c8",
    "Atraso Motivo Chuva": "6a2f3141-a208-4691-aa1a-a53848822c39",
    "Cartão Extraviado": "1e0c2bf1-d785-4f2d-b1d9-c2bc46285dbe",
    "Cartão Entregue": "89b57444-97ea-4fdf-ab01-99756cba1f7f",
    "Falecido": "1eb1a73c-a5a7-42bf-b2f9-014c226c4e25",
    "Alto Risco / Difícil Acesso / CEP Não Atendido / Roteiro Indevido / Zona Rural": "b326084b-2d09-4d61-b505-1386715a75e0",
    "Em Análise - Evento Não Mapeado": "ad99bf65-05d0-4263-bbb5-f96bae498914",
    "Recusado / Devolução A Pedido de Cliente": "89e9871d-b8de-4c4f-b773-f4e4eaae0fd1",
    "Destinatário Ausente": "cdd6ef37-b85f-49b3-b606-053445f5cd0a",
    "Endereço Incorreto": "69731d0b-3b14-49d6-ad77-5ff8b6719c17",
    "Protocolado para Destruição": "9aca5762-91d5-4351-a965-9d0d6671afd3",
    "Habilitado para Reenvio": "068069b4-2394-421e-9175-c5b6ffdd4095",
    "Embossadora Não Mapeada": "61b12f45-7242-4634-9b99-a5207080096e",
    "Sem Retorno - Flash Courier - Encerramento Automatico": "981ca0d2-cc12-48ef-82b9-0afc0c8f2913",
    "Ciclo Operacional Encerrado": "a3c97626-56f0-427f-9692-e5d3329934f8",
    "Entregue aos Correios": "ab8f1080-4089-4a0e-aad5-7c9f58aae9ea",
    "Aguardando Retirada": "0e4f46e4-77f4-46f6-a5ab-12a77945934c",
    "Cartão Não Expedido": "883b838b-3195-4144-abbe-4baf143d3c08",
    "Ticket Encerrado": "8889f382-5d61-4f80-8f2b-15059f23cd25"
    } */
  const getTabname = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://forceflow.tech4h.com.br/tickets/2023071214054345635?expansions[]=driver.tabs`,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImM4MzQ3OTA5LWYyYmYtNDQ5Ni1hM2RhLTU2Mzc4NjJjN2Y2ZCIsImlhdCI6MTY4MjYyNTY3N30.cP6R369q3lRz5gbcz2RtIvppsk7a0-DYwY-aELrK6AI",
      },
    };
    const response = await axios(config);
    return response.data.driver.tabs;
  };
  const driverTabs = await getTabname();

  const tabName = driverTabs
    .filter(
      (tab) =>
        tab.tabId === ticketAutomationFlowBlock.ticketAutomationFlow.automationFlowTrigger.tabId
    )
    .map(({ tabName }) => tabName);

  const getApiBackInegrado = async (tabName) => {
    try {
      const data = {
        method: "post",
        url: "https://backintegradoqa.azurewebsites.net/card-track/initial",
        headers: { "Content-Type": "application/json" },
        data: {
          conversationId: ticket.properties.conversationId,
          protocol: ticket.protocol,
          cpf: ticket.customer.document,
          cardId: ticket.payloadOrigin.data.idCartao,
          tabulationName: tabName,
          changeAddress: true,
          hasError: true,
          dateAPIs: Date.now(),
        },
      };
      const response = await axios(data);
      return response.data;
    } catch (error) {
      throw new Error("Integrated back api error", error);
    }
  };
  console.log(await getApiBackInegrado(tabName[0]));
  return await getApiBackInegrado(tabName[0]);
}

apiBackIntegrated();
