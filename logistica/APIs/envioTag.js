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

async function apiPostFlash() {
  const env = "prod";
  const codigoRastreio = ticket.payloadOrigin.conectCarP1.codigoRastreio;
  const errorFactory = (errorName, error, config = null) => {
    const request = config ? `request: ${JSON.stringify(config)}` : "";
    const erro = `${errorName}${request}`;
    const status = `${error.response.status}`;

    if (error.response.data.error) {
      const message = `${error.response.data.message}`;
      const stack = `${error.response.data.error || ""}`;
      return new Error(
        `${erro}\n Status: ${status}\n Message: ${message}\n Stack: ${stack}`
      );
    }
    const message = `${
      error.response.data.errors[0].message || error.response.data
    }`;
    const stack = `${
      error.response.data.error_description ||
      error.response.statusText ||
      error.code
    }`;
    return new Error(
      `${erro}\n Status: ${status}\n Message: ${message}\n Stack: ${stack}`
    );
  };

  const getAmbient = async () => {
    const urlToken = {
      prod: "https://portoapicloud.portoseguro.com.br/oauth/v2/access-token",
      hml: "https://portoapicloud-sandbox.portoseguro.com.br/oauth/v2/access-token",
    }[env];
    const Authorization = {
      prod: "Basic M2Q3YzBjMDktMmM0NS0zNWMwLTljZWYtYTM3OGExNzZiY2U5OjYxODZmMmM3LWIzYmEtM2EwZi1hODc1LWQ1NDU5ODY3ZDZjNQ==",
      hml: "Basic M2Q3YzBjMDktMmM0NS0zNWMwLTljZWYtYTM3OGExNzZiY2U5OjYxODZmMmM3LWIzYmEtM2EwZi1hODc1LWQ1NDU5ODY3ZDZjNQ==",
    }[env];
    const urlSend = {
      prod: "https://portoapicloud.portoseguro.com.br/logistica/tag/v1/flash",
      hml: "https://portoapicloud-sandbox.portoseguro.com.br/logistica/tag/v1/flash",
    }[env];
    return {
      urlToken,
      urlSend,
      Authorization,
    };
  };
  const ambient = await getAmbient();

  const getToken = async () => {
    try {
      let data = qs.stringify({
        grant_type: "client_credentials",
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: ambient.urlToken,
        headers: {
          Authorization: ambient.Authorization,
          Cookie:
            "incap_ses_1239_2657734=VJSsLJs83wpeXUuZ9tAxETXjrGQAAAAAyhT+Km8OcefmEIARoejTOQ==; incap_ses_1239_2661887=szNRaebaZRSEmkaZ9tAxEe7OrGQAAAAAqX720OOo/tG88AQWMlhDUA==; incap_ses_1239_2683398=7mjlXxM9YBXZpmaZ9tAxEbdGrWQAAAAAJ55Tjz/syJJxP84CSCzARQ==; incap_ses_1239_2683399=FJG2R92hCEKqJHCZ9tAxETNVrWQAAAAAn3y/3Fvlu4XXc3zwYCI9EQ==; incap_ses_1614_2622269=z1yQGlikw1Vwbw8SwhRmFkl1rWQAAAAA5/QN7lbU6zumph9rLrFx3w==; incap_ses_1614_2683398=oOdhZ0Fu9jBZeDkSwhRmFpyKrWQAAAAA4mWP4lm4gqDpP1/BX7z7PA==; incap_ses_1614_2683399=q+YkfLPs/h9lSTYSwhRmFgmJrWQAAAAAmIsl+3bHbPm2Fh+TKnGkjA==; nlbi_2622269=rpS4JIqXPQKK4K8ONjGQPgAAAAAUj14AXP0uYayajjZ0k586; nlbi_2657734=U3pVTQ/VlCXLiNWmJ7xnKQAAAAB/LDv8FUmnNDPEahJYPInU; nlbi_2661887=5d7LXxfmiCHW8BnAngfFNwAAAACyTkEiJ22vaNccFZkaVeSf; nlbi_2683398=z+r/RaHIsWNXfVO6W0Xy2gAAAAAKEu39CQ2mKRwjM75LDypR; nlbi_2683399=sxP2Hom3jwZRpsJKDWoq9wAAAADJNpSPtlKJGy2hRTiMOk4S; visid_incap_2574372=dOh3CAtzTvmqonM6zj60USsSWWQAAAAAQUIPAAAAAABEqBxY1/MGvDcSlyIN/yHK; visid_incap_2622269=18pRmXWJRr2pUknzzOWRaEl1rWQAAAAAQUIPAAAAAAAd7mvuY1fh07cNMuuEWD2n; visid_incap_2657734=jED+S3lgTUKOXwWAT3Cl4FumrGQAAAAAQUIPAAAAAABOuIgJtejf8Mc13JbmsJof; visid_incap_2661887=MMxOWosLTPyLPwzs9ug2gbOkrGQAAAAAQUIPAAAAAABn7L8OquXgEhtlUoWXCz3d; visid_incap_2683398=fvSAxNPPTRi5h3Vc82Ui1V3arGQAAAAAQUIPAAAAAAAjl32m0TpRV6ZApm82PxGf; visid_incap_2683399=CxI5LJKlRNyHVb+8mfm7xebJiWQAAAAAQUIPAAAAAABL5wkf/NxP+acL3e+opsdG; ROUTEID=.web3",
        },
        data: data,
      };
      const token = await axios(config);
      return token.data.access_token;
    } catch (err) {
      console.log(err);
      throw errorFactory("error create token", err);
    }
  };

  const token = await getToken();

  const getEncomenda = async () => {
    let data = JSON.stringify([
      {
        cliente_id: 2087,
        ctt_id: 9089,
        dna_hawb: 7,
        ccusto_id: 32635,
        tipo_enc_id: 18891,
        prod_flash_id: 5,
        frq_rec_id: "SAO",
        num_enc_cli: `${codigoRastreio}`,
        num_cliente: "12079999921",
        nome_rem: "Eudes",
        endHawbs: {
          nome_des: "Rafael Tavares",
          logr_dest: "Rua Princesa Isabel",
          bairro_des: "Brooklin",
          num_des: "225",
          cid_dest: "sao paulo",
          uf_dest: "sp",
          cep_dest: 4601000,
          fone1_des: "11980561628",
        },
        cod_lote: "27180516",
        peso_declarado: 0.03,
        qtde_itens: "1.0",
        valor: 1,
        endHawbs2: {
          nome_des: "",
          logr_dest: "",
          bairro_des: "",
          num_des: "",
          compl_end_dest: "",
          cid_dest: "",
          uf_dest: "",
          cep_dest: null,
          fone1_des: "",
          fone2_des: "",
          fone3_des: "",
        },
        id_local_rem: 19401,
        cpf_des: "",
        cnpj_des: "",
        ie_des: "",
        email_des: "eudesrt@gmail.com",
        ge4: `${ticket.protocol}`,
        chave_nf: "123456234567",
      },
    ]);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ambient.urlSend,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Cookie:
          "incap_ses_1239_2657734=VJSsLJs83wpeXUuZ9tAxETXjrGQAAAAAyhT+Km8OcefmEIARoejTOQ==; incap_ses_1239_2661887=szNRaebaZRSEmkaZ9tAxEe7OrGQAAAAAqX720OOo/tG88AQWMlhDUA==; incap_ses_1239_2683398=7mjlXxM9YBXZpmaZ9tAxEbdGrWQAAAAAJ55Tjz/syJJxP84CSCzARQ==; incap_ses_1239_2683399=FJG2R92hCEKqJHCZ9tAxETNVrWQAAAAAn3y/3Fvlu4XXc3zwYCI9EQ==; incap_ses_1614_2622269=z1yQGlikw1Vwbw8SwhRmFkl1rWQAAAAA5/QN7lbU6zumph9rLrFx3w==; incap_ses_1614_2683398=oOdhZ0Fu9jBZeDkSwhRmFpyKrWQAAAAA4mWP4lm4gqDpP1/BX7z7PA==; incap_ses_1614_2683399=q+YkfLPs/h9lSTYSwhRmFgmJrWQAAAAAmIsl+3bHbPm2Fh+TKnGkjA==; nlbi_2622269=rpS4JIqXPQKK4K8ONjGQPgAAAAAUj14AXP0uYayajjZ0k586; nlbi_2657734=U3pVTQ/VlCXLiNWmJ7xnKQAAAAB/LDv8FUmnNDPEahJYPInU; nlbi_2661887=5d7LXxfmiCHW8BnAngfFNwAAAACyTkEiJ22vaNccFZkaVeSf; nlbi_2683398=z+r/RaHIsWNXfVO6W0Xy2gAAAAAKEu39CQ2mKRwjM75LDypR; nlbi_2683399=sxP2Hom3jwZRpsJKDWoq9wAAAADJNpSPtlKJGy2hRTiMOk4S; visid_incap_2574372=dOh3CAtzTvmqonM6zj60USsSWWQAAAAAQUIPAAAAAABEqBxY1/MGvDcSlyIN/yHK; visid_incap_2622269=18pRmXWJRr2pUknzzOWRaEl1rWQAAAAAQUIPAAAAAAAd7mvuY1fh07cNMuuEWD2n; visid_incap_2657734=jED+S3lgTUKOXwWAT3Cl4FumrGQAAAAAQUIPAAAAAABOuIgJtejf8Mc13JbmsJof; visid_incap_2661887=MMxOWosLTPyLPwzs9ug2gbOkrGQAAAAAQUIPAAAAAABn7L8OquXgEhtlUoWXCz3d; visid_incap_2683398=fvSAxNPPTRi5h3Vc82Ui1V3arGQAAAAAQUIPAAAAAAAjl32m0TpRV6ZApm82PxGf; visid_incap_2683399=CxI5LJKlRNyHVb+8mfm7xebJiWQAAAAAQUIPAAAAAABL5wkf/NxP+acL3e+opsdG; ROUTEID=.web3",
      },
      data: data,
    };
    const response = (await axios(config)).data;
    return response;
  };

  const response = await getEncomenda();
  console.log(response);
  return response;
}
