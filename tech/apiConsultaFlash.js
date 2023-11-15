const axios = require("axios");
const qs = require("qs");
const ticket = require("./general.json");
const [, , esteira, ar] = process.argv;

async function apiConsultaFlash() {
  const env = "prod";

  const getCodigoRastreio = async () => {
    if (esteira == "embossing" || esteira == "tag") {
      const codigoRastreio = ar;
      return codigoRastreio;
    } else if (esteira == "cartao") {
      const codigoRastreio = `FL0000000${ar}BR`;
      return codigoRastreio;
    }
  };
  const codigoRastreio = await getCodigoRastreio();

  const getAmbient = async () => {
    const url = {
      prod: "https://portoapicloud.portoseguro.com.br/logistica/tag/v1/flash/encomendas/",
      hml: "https://homolog.flashpegasus.com.br/FlashPegasus/rest/porto/consulta",
    }[env];
    return url;
  };
  const ambient = await getAmbient();

  const getToken = async () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://portoapicloud.portoseguro.com.br/oauth/v2/access-token",
      headers: {
        Authorization:
          "Basic M2Q3YzBjMDktMmM0NS0zNWMwLTljZWYtYTM3OGExNzZiY2U5OjYxODZmMmM3LWIzYmEtM2EwZi1hODc1LWQ1NDU5ODY3ZDZjNQ==",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie:
          "incap_ses_1298_2574372=a/J9F5QiejDqUysL42wDEv5ixmQAAAAAc0dzq5blwnBNjqM6jBxXAA==; incap_ses_1298_2683399=ETXlcPCrdW0zaDEL42wDEp9rxmQAAAAAgOzZ/61aCz51f7NKzO65eA==; nlbi_2574372=RJ8uSH43rgJnSN8k4GJjfgAAAAAc/3+HsBwwBNm+xg7rAXH0; nlbi_2683399=QCyzVF7Ft0yhn9qKDWoq9wAAAACvlbEgJnLyHx9kKmnqfbpY; visid_incap_2574372=dOh3CAtzTvmqonM6zj60USsSWWQAAAAAQUIPAAAAAABEqBxY1/MGvDcSlyIN/yHK; visid_incap_2622269=18pRmXWJRr2pUknzzOWRaEl1rWQAAAAAQUIPAAAAAAAd7mvuY1fh07cNMuuEWD2n; visid_incap_2657734=jED+S3lgTUKOXwWAT3Cl4FumrGQAAAAAQUIPAAAAAABOuIgJtejf8Mc13JbmsJof; visid_incap_2661887=MMxOWosLTPyLPwzs9ug2gbOkrGQAAAAAQUIPAAAAAABn7L8OquXgEhtlUoWXCz3d; visid_incap_2683396=SDxitWOiQLe/iVBPyEptIlBAuGQAAAAAQUIPAAAAAAAY4LDWB+q4vAIEu5CY51G4; visid_incap_2683397=qZL3LMiGQrukzn4MDn2YG8kpuGQAAAAAQUIPAAAAAACUOM5Vcft2MrMuAD7OXEwE; visid_incap_2683398=fvSAxNPPTRi5h3Vc82Ui1V3arGQAAAAAQUIPAAAAAAAjl32m0TpRV6ZApm82PxGf; visid_incap_2683399=CxI5LJKlRNyHVb+8mfm7xebJiWQAAAAAQUIPAAAAAABL5wkf/NxP+acL3e+opsdG",
      },
      data: qs.stringify({
        grant_type: "client_credentials",
      }),
    };
    const token = await axios(config);
    return token.data.access_token;
  };
  const token = await getToken();

  const getAr = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${ambient}${codigoRastreio}`,
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie:
            "incap_ses_1298_2574372=a/J9F5QiejDqUysL42wDEv5ixmQAAAAAc0dzq5blwnBNjqM6jBxXAA==; incap_ses_1298_2683399=ETXlcPCrdW0zaDEL42wDEp9rxmQAAAAAgOzZ/61aCz51f7NKzO65eA==; nlbi_2574372=RJ8uSH43rgJnSN8k4GJjfgAAAAAc/3+HsBwwBNm+xg7rAXH0; nlbi_2683399=QCyzVF7Ft0yhn9qKDWoq9wAAAACvlbEgJnLyHx9kKmnqfbpY; visid_incap_2574372=dOh3CAtzTvmqonM6zj60USsSWWQAAAAAQUIPAAAAAABEqBxY1/MGvDcSlyIN/yHK; visid_incap_2622269=18pRmXWJRr2pUknzzOWRaEl1rWQAAAAAQUIPAAAAAAAd7mvuY1fh07cNMuuEWD2n; visid_incap_2657734=jED+S3lgTUKOXwWAT3Cl4FumrGQAAAAAQUIPAAAAAABOuIgJtejf8Mc13JbmsJof; visid_incap_2661887=MMxOWosLTPyLPwzs9ug2gbOkrGQAAAAAQUIPAAAAAABn7L8OquXgEhtlUoWXCz3d; visid_incap_2683396=SDxitWOiQLe/iVBPyEptIlBAuGQAAAAAQUIPAAAAAAAY4LDWB+q4vAIEu5CY51G4; visid_incap_2683397=qZL3LMiGQrukzn4MDn2YG8kpuGQAAAAAQUIPAAAAAACUOM5Vcft2MrMuAD7OXEwE; visid_incap_2683398=fvSAxNPPTRi5h3Vc82Ui1V3arGQAAAAAQUIPAAAAAAAjl32m0TpRV6ZApm82PxGf; visid_incap_2683399=CxI5LJKlRNyHVb+8mfm7xebJiWQAAAAAQUIPAAAAAABL5wkf/NxP+acL3e+opsdG; ROUTEID=.web3",
        },
      };
      const response = await axios(config);
      if (!response) {
        throw new Error("Produto não expedido!");
      } else {
        const result = response.data.hawbs[0].historico.reverse(); //[0];
        return result;
      }
    } catch (error) {
      throw new Error("Produto não expedido!", error);
    }
  };
  const result = await getAr();
  console.log(result);
  return result;
}

apiConsultaFlash();
