const { closeTickets } = require("./apiFinishTickets");
const { apiTabularTickerts } = require("./apiTabularTickets");
const [, , slug, ambient, execute, tabId, text, privateNote] = process.argv;

if (execute != "encerrar" || execute != "tabular") {
  console.info("Favor digite os argumentos corretos na linha de comando");
} else {
  importCsv();
}

async function exec() {
  const clientIds = async () => {
    try {
      const dados = {
        porto: {
          qa: "7a93f9f1-dbcd-4525-9e3c-95cde631df30",
          prod: "c8347909-f2bf-4496-a3da-5637862c7f6d",
        }[ambient],
        orquestrador: {
          qa: "Não tem clientId em QA",
          prod: "c63d8282-099d-4409-9882-84078b9f7371",
        }[ambient],
        allianz: {
          qa: "b3d622e3-73c9-4197-a66f-2a416d7d806",
          prod: "4f88baa1-d454-41c1-88b6-956b95ea31e7",
        }[ambient],
      }[slug];
      return dados;
    } catch (error) {
      throw new Error("error get clientId", error);
    }
  };
  const clientId = await clientIds();

  const arrayEncerrar = [];
  const arrayTabular = [];

  async function importCsv() {
    const clientId = await clientIds();
    const csvFilePath = "./tech/csv/tickets.csv";
    const csv = require("csvtojson");
    const jsonArray = await csv({
      delimiter: ";",
    }).fromFile(csvFilePath);

    if (execute == "encerrar") {
      // ENCERRAR
      const encerrarTickets = async () => {
        for (const row of jsonArray) {
          if (row.action == "encerrar") {
            arrayEncerrar.push({
              id: row.conversation,
            });
          }
        }
        closeTickets(arrayEncerrar, clientId);
      };
      encerrarTickets();
    } else if (execute == "tabular") {
      // TABULAR
      const tabularTickets = async () => {
        for (const row of jsonArray) {
          if (row.action == "tabular") {
            arrayTabular.push({
              id: row.conversation,
            });
          }
        }
        apiTabularTickerts(
          arrayTabular,
          tabId,
          slug,
          ambient,
          text,
          privateNote
        );
      };
      tabularTickets();
    } else {
      console.log("Você precisa passar um argumento na linha de comando!");
    }
  }
  const result = importCsv(clientId);
  return result;
}

exec();
