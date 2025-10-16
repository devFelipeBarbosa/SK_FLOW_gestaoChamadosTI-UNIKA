// Registro da Solicitação - na tabela AD_CHAMADOSTI (INICIALIZACÃO)
var solicitacao = getIdInstanceProcesso(); // ID da Solicitação
var codUsu = getIdInstanceProcesso(); // ID do Usuário Solicitante

var tipo = getCampo("TIPO") || 'I';
var codLocal = getCampo("CODLOCAL") || Number(0);
var categoria = getCampo("CATEGORIA") || Number(0);


