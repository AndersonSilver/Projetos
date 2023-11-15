const axios = require("axios");
const ticket = require("./general.json");
const fs = require("fs");
const qs = require("qs");
const [, , protocol, tipo, slug, ambient] = process.argv;
const FormData = require("form-data");
const data = {
  result: {
    telefone: "35997161655",
    email: "luiz.souza@Ttech4h.com.br",
  },
};

async function getdocumentsBcp() {
  const anexo = ticket.payloadOrigin.data.anexoBoleto.url;
  const emailTicket = ticket.customer.email;
  const phoneTicket = ticket.customer.phone;
  const env = ticket.payloadOrigin.data.campo01;

  const getAmbient = async () => {
    const urlToken = {
      prod: "https://api.portoseguro.com.br/bcp/autenticacao/v1/login",
      hml: "https://apihml.portoseguro.com.br/bcp/autenticacao/v1/login",
      dev: "https://apihml.portoseguro.com.br/bcp/autenticacao/v1/login",
    }[env];
    const Authorization = {
      prod: "client_id=9ebeb577-d1a9-49f4-8a59-6fbd72aca68e&client_secret=869ff129-0bb2-4304-ade0-f4e8a0b5c0d4&username=slpthgpd&password=iftn%40I11&grant_type=PASSWORD",
      hml: "client_id=274f9adb-0527-4562-bdf2-20f557b31424&client_secret=b14169bc-27d4-4a1e-8b61-e66b71b61b52&username=slhthgpd&password=pfjg%40P45&grant_type=PASSWORD",
      dev: "client_id=274f9adb-0527-4562-bdf2-20f557b31424&client_secret=b14169bc-27d4-4a1e-8b61-e66b71b61b52&username=slhthgpd&password=pfjg%40P45&grant_type=PASSWORD",
    }[env];
    const urlConsulta = {
      prod: "https://api.portoseguro.com.br/bcp/v1/dadospessoa?numDocumento=",
      hml: "https://apihml.portoseguro.com.br/bcp/v1/dadospessoa?numDocumento=",
      dev: "https://apihml.portoseguro.com.br/bcp/v1/dadospessoa?numDocumento=",
    }[env];
    return {
      urlToken,
      urlConsulta,
      Authorization,
    };
  };
  const ambient = await getAmbient();

  const getToken = async () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ambient.urlToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        idp: "6",
        Cookie:
          "incap_ses_1239_2657734=TYA8c1zzw34eSTWZ9tAxEXOmrGQAAAAAyLyXFwgzIlgKaiUOSdzTGw==; incap_ses_1239_2661887=V/b5NGHpwm1etkKZ9tAxERvDrGQAAAAAQnfQPRgla1fWxRtK0q5ihA==; nlbi_2657734=yknpdzYOplsqzxTeJ7xnKQAAAAAmyMMLGJXcqo2ppgmWphtf; nlbi_2661887=5d7LXxfmiCHW8BnAngfFNwAAAACyTkEiJ22vaNccFZkaVeSf; visid_incap_2574372=dOh3CAtzTvmqonM6zj60USsSWWQAAAAAQUIPAAAAAABEqBxY1/MGvDcSlyIN/yHK; visid_incap_2657734=jED+S3lgTUKOXwWAT3Cl4FumrGQAAAAAQUIPAAAAAABOuIgJtejf8Mc13JbmsJof; visid_incap_2661887=MMxOWosLTPyLPwzs9ug2gbOkrGQAAAAAQUIPAAAAAABn7L8OquXgEhtlUoWXCz3d; visid_incap_2683399=CxI5LJKlRNyHVb+8mfm7xebJiWQAAAAAQUIPAAAAAABL5wkf/NxP+acL3e+opsdG",
      },
      data: ambient.Authorization,
    };
    try {
      const token = await axios(config);
      return token.data.access_token;
    } catch (err) {
      throw errorFactory("error create token", err);
    }
  };

  const getPortoSeguroBcpDadosPessoais = async () => {
    const token = await getToken();
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ambient.urlConsulta}${ticket.customer.document}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
        Cookie:
          "d17bf35600001653802edc6660efb37c=6a85f1891df9bc0b8d6cbbb98b9cf2a6; incap_ses_1239_2657734=TYA8c1zzw34eSTWZ9tAxEXOmrGQAAAAAyLyXFwgzIlgKaiUOSdzTGw==; incap_ses_1239_2661887=A0boVsIvol9jSTSZ9tAxEbOkrGQAAAAArk6zYL1RBo1H5qmjNf1LSw==; nlbi_2657734=yknpdzYOplsqzxTeJ7xnKQAAAAAmyMMLGJXcqo2ppgmWphtf; nlbi_2661887=4EGsKnJEhApfSUNMngfFNwAAAABnlcORgJAw4MbK7dHCrgZo; visid_incap_2574372=dOh3CAtzTvmqonM6zj60USsSWWQAAAAAQUIPAAAAAABEqBxY1/MGvDcSlyIN/yHK; visid_incap_2657734=jED+S3lgTUKOXwWAT3Cl4FumrGQAAAAAQUIPAAAAAABOuIgJtejf8Mc13JbmsJof; visid_incap_2661887=MMxOWosLTPyLPwzs9ug2gbOkrGQAAAAAQUIPAAAAAABn7L8OquXgEhtlUoWXCz3d; visid_incap_2683399=CxI5LJKlRNyHVb+8mfm7xebJiWQAAAAAQUIPAAAAAABL5wkf/NxP+acL3e+opsdG",
      },
    };

    try {
      const response = (await axios(config)).data;
      const turnDateDMYtoYMD = (date) =>
        new Date(date.split("-").reverse().join("-"));
      const updatedEmail = response.emails.sort(
        (a, b) =>
          turnDateDMYtoYMD(b.dataAtualizacaoEmail) -
          turnDateDMYtoYMD(a.dataAtualizacaoEmail)
      )[0];
      const mostRecentEmail = updatedEmail
        ? updatedEmail.email
        : ticket.customerEmail;

      if (
        response.enderecos[0].uf === "$\u0000" ||
        response.enderecos[0].uf === "$"
      )
        response.enderecos[0].uf = "Não Informado";
      const celphone = response.telefones.find(
        (telefone) => telefone //.tipo === "CELULAR"
      );
      return {
        telefone: `+${celphone.ddi}${celphone.ddd}${celphone.numero}`,
        email: mostRecentEmail,
      };
    } catch (err) {
      return "Nenhum dado de pessoa encontrado";
    }
  };
  const bcpData = await getPortoSeguroBcpDadosPessoais();
  try {
    if (!bcpData.email && !emailTicket) {
      console.log({
        status:
          "Nenhum dado de pessoa encontrado e email nao informado no ticket",
      });
      return {
        status:
          "Nenhum dado de pessoa encontrado e email nao informado no ticket",
      };
    } else {
      const filtraDadosTickets = async () => {
        try {
          if (!emailTicket && !phoneTicket) {
            return {
              status: "",
              telefone: bcpData.telefone,
              email: bcpData.email,
              anexo,
            };
          } else if (!phoneTicket && emailTicket !== "") {
            const telefone = bcpData.telefone;
            const email = emailTicket;
            return {
              status: "",
              telefone,
              email,
              anexo,
            };
          } else if (!emailTicket && phoneTicket !== "") {
            const telefone = phoneTicket;
            const email = bcpData.email;
            return {
              status: "",
              telefone,
              email,
              anexo,
            };
          } else {
            const telefone = phoneTicket;
            const email = emailTicket;
            return {
              status: "",
              telefone,
              email,
              anexo,
            };
          }
        } catch (error) {
          throw new Error("error validating ticket data", err);
        }
      };

      const filtroDados = await filtraDadosTickets();
      console.log(filtroDados);
      return filtroDados;
    }
  } catch (err) {
    throw new Error("error get template", err);
  }
}

getdocumentsBcp();
