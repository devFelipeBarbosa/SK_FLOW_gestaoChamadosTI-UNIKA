// Candidato Dinamico para atividade "Em Atendimento" na tela de Chamados TI
var solicitacao = getIdInstanceProcesso();

var query = "SELECT CODUSU AS COLUNA, 'U' AS TIPO FROM AD_AGENTESCHAMADO WHERE IDINSTPRN = :IDINSTPRN AND TIPOATRIBUICAO IN ('D','C')";

return getLista(query, [solicitacao]);


