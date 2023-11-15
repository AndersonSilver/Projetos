const fs = require("fs");
const axios = require("axios");

async function closeTickets(arrayEncerrar, clientId) {
  token_canal =
    //allianz
    clientId == "4f88baa1-d454-41c1-88b6-956b95ea31e7"
      ? "DNWSP2Nytfdh4jY5vtTWnq6eaI"
      : clientId == "b3d622e3-73c9-4197-a66f-2a416d7d8069"
      ? "b3d622e3-73c9-4197-a66f-2a416d7d8069"
      : //porto
      clientId == "c8347909-f2bf-4496-a3da-5637862c7f6d"
      ? "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
      : clientId == "7a93f9f1-dbcd-4525-9e3c-95cde631df30"
      ? "XHQVyQsaiLQY5FhvA"
      : //orquestrador
      clientId == "c63d8282-099d-4409-9882-84078b9f7371"
      ? "ZKjZNILobwjufLB1xOhfPXUObkQa6n9X"
      : "default_value_here";

  const arrayRequest = arrayEncerrar.map(({ id }) =>
    createRequest(id, clientId)
  );
  const arrayResponse = await Promise.allSettled(arrayRequest);

  arrayResponse.forEach((item, i) => {
    if (item.status == "fulfilled") {
      console.info(`Ticket ${i + 1} Closed!:`, {
        id: item.value.data.id,
        status: item.value.status,
      });
    } else if (item.status == "rejected") {
      if (item.reason.response.data.message) {
        const errorLog = {
          error: item.reason.response.data.message,
          status: item.reason.response.status,
        };
        saveLog(`Error closing ticket ${i + 1}`, errorLog);
        console.info(`Error closing ticket ${i + 1}`, errorLog);
      } else if (!item.reason.response.data.message) {
        const errorLog = {
          error: item.reason.response.data.message,
          status: item.reason.response.status,
        };
        saveLog(`Error closing ticket ${i + 1}`, errorLog);
        console.info(`Error closing ticket ${i + 1}`, errorLog);
      }
    } else {
      console.error("erro desconhecido!");
    }
  });
}

function createRequest(id, clientId) {
  const options = {
    method: "POST",
    url: `https://api-messages.tech4h.com.br/channel/realautomation/receive/${clientId}/${token_canal}`,
    headers: { "Content-Type": "application/json" },
    data: { action: "close", conversationId: id },
  };
  return axios.request(options);
}

function saveLog(message, log) {
  fs.appendFile(
    "api_log.txt",
    `${message}: ${JSON.stringify(log)}\n`,
    (err) => {
      if (err) {
        console.error("Erro ao salvar o log:", err);
      }
    }
  );
}

module.exports = { closeTickets };
