// Candidato Dinamico para atividade "Em Atendimento" na tela de Chamados TI
var solicitacao = getIdInstanceProcesso();

var query = "SELECT CODUSU AS COLUNA, 'U' AS TIPO FROM AD_AGENTESCHAMADO WHERE IDINSTPRN = :IDINSTPRN AND TIPOATRIBUICAO IN ('D','C')";

if (query) {
    return getLista(query, [solicitacao]);
} else {
    return "G = 18"; // Grupo de Usuários TI
}



