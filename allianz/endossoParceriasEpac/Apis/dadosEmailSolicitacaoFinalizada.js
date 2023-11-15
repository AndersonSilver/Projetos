async function dadosEmailSolicitacaoFinalizada() {
  const text = `Olá, ${data.result.nomeCorretor}.
    
  Concluímos sua solicitação, n°: ${ticket.protocol}, sobre
  temas relacionados ao endosso com sucesso!
  
  ${data.result.nota}
  
  Para conferir o documento gerado a partir
  dela, consulte a ficha de gestão ou o histórico
  na ferramenta Gestor de Operações através
  do link: https://wwwi.br.intrallianz.com/ngx-epac/public/home
  
  Atenciosamente,
  Allianz Seguros.`;

  return text;
}
