const axios = require("axios");
const ticket = require("./general.json");
const fs = require("fs");
const qs = require("qs");
const [, , alias] = process.argv;
const FormData = require("form-data");

async function formTemplate() {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://ra-front-door-prod-f4dxdag5b9dse8hq.z01.azurefd.net/api/form/readByAlias?alias=${alias}&clientId=c8347909-f2bf-4496-a3da-5637862c7f6d`,
      headers: {},
    };

    const response = await axios(config);
    const result = response.data;
    const formTemplate = result.data.formTemplate;

    fs.writeFile(
      "./tech/resultado.json",
      JSON.stringify(formTemplate),
      (err) => {
        if (err) {
          console.error("Erro ao salvar o arquivo JSON:", err);
        } else {
          console.log("O resultado foi salvo com sucesso em resultado.json");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}
formTemplate();
