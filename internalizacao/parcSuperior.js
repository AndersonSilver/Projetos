async function parcelamentoSuperior() {
  
  const errorFactory = (errorName, error, config = null) => {
    const request = config ? `request: ${JSON.stringify(config)}` : "";
    const erro = `${errorName}${request}`;
    const message = `${error.response.data.error.message}`;
    return new Error(`${erro}\nMessage: ${message}`);
  };

  var parcela = ticket.custom.contestacao_transacao_credito.parcelaAtual;
  const dataTrasacao = ticket.custom.contestacao_transacao_credito.data;

  var parcelaAtual = parcela + 1;

  let dataProcessamento = new Date(dataTrasacao);
  dataProcessamento.setDate(
    dataProcessamento.getDate() + parcelaAtual * 30 - 30
  );

  try {

    const data = {
      formId: 99,
      custom: {
        contestacao_transacao_credito: {
            tipoDePessoa: ticket.custom.contestacao_transacao_credito.tipoDePessoa,
            data: ticket.custom.contestacao_transacao_credito.data,
            nAutorizacao: ticket.custom.contestacao_transacao_credito.nAutorizacao,
            cartao: ticket.custom.contestacao_transacao_credito.cartao,
            estabelecimento: ticket.custom.contestacao_transacao_credito.estabelecimento,
            conta: ticket.custom.contestacao_transacao_credito.conta,
            nomedoportador: ticket.custom.contestacao_transacao_credito.nomedoportador,
            valorDisputa:  ticket.custom.contestacao_transacao_credito.valorDisputa,
            dataAbertura: ticket.custom.contestacao_transacao_credito.dataAbertura,
            bandeira: ticket.custom.contestacao_transacao_credito.bandeira,
            codigoInterno:  ticket.custom.contestacao_transacao_credito.codigoInterno,
            categoriaDisputa: ticket.custom.contestacao_transacao_credito.categoriaDisputa,
            motivoDisputa: ticket.custom.contestacao_transacao_credito.motivoDisputa,
            motivoBandeira: ticket.custom.contestacao_transacao_credito.motivoBandeira,
            faturada: ticket.custom.contestacao_transacao_credito.faturada,
            parcelaAtual,
            totalDeParcelas: ticket.custom.contestacao_transacao_credito.totalDeParcelas,
            canalDeEntrada: ticket.custom.contestacao_transacao_credito.canalDeEntrada,
            telefoneCelularDoCliente: ticket.custom.contestacao_transacao_credito.telefoneCelularDoCliente,
            parcelamento: "Superior",
            valor: ticket.custom.contestacao_transacao_credito.valor,
            dataProcessamento
          },
      },
      customerSocialNumber: ticket.customerSocialNumber,
      customerEmail: ticket.customerEmail,
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ra-front-door-prod-f4dxdag5b9dse8hq.z01.azurefd.net/api/ticket/create?clientId=c8347909-f2bf-4496-a3da-5637862c7f6d",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const result = await axios(config);
    //console.log(`protocol: ${result.data.data.protocol}`, data);
    return result.data.data;

  } catch (error) {
    throw errorFactory("Falha ao abrir ticket", error);
  }
  
}