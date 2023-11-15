async function dadosEmailPendenciaCorretor() {
  const text = `Olá, ${data.result.nomeCorretor}.
Recebemos seu pedido ticket n°: ${ticket.protocol}
referente ao endosso.

${data.result.nota}

`;

  return text;
}
