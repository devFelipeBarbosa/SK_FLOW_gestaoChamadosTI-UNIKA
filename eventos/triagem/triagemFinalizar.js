// Finalizar uma tarefa na triagem 
var solicitacao = getIdInstanceProcesso(); // ID da Solicitação 
var codUsu = getUsuarioInclusao(); // ID do Usuário Solicitante 
var tabChamado = getLinhasFormulario("AD_CHAMADOTI"); // Retorna as linhas Tabela de Chamados TI (AD_CHAMADOTI)
var tabDispositivos = getLinhasFormulario("AD_EQUIPDISPCHAMADO"); // Retorna as linhas Tabela de Dispositivos (AD_EQUIPDISPCHAMADO)
var tabAgentesChamado = getLinhasFormulario("AD_AGENTESCHAMADO"); // Retorna as linhas Tabela de Agentes do Chamado (AD_AGENTESCHAMADO)
var linhaExistente = false; // Boleano para verificar existência de chamado TI para a solicitação 
var c = null; // contador genérico para encontrar linha cadastro do Formulário

// Verifica se já existe uma linha na tabela de chamados TI para a solicitação atual 
for (var i = 0; i < tabChamado.length; i++) {
    if (tabChamado[i].getCampo("IDINSTPRN") == solicitacao) {
        linhaExistente = true;
        c = i;
        break;
    }
}


if (linhaExistente) {
    var statusCiclo1 = tabChamado[c].getCampo("CICLO1");
    if (statusCiclo1 == 'NA') {
        throw new Error("Erro ao finalizar a triagem: <br>O chamado está <b>aguardando definição</b>!");
    } 
    
    if ((statusCiclo1 == 'N' || statusCiclo1 == 'A') && (!tabChamado[c].getCampo("JUSTIFICATIVA") || tabChamado[c].getCampo("JUSTIFICATIVA") == null)) {
        throw new Error("Erro ao finalizar a triagem: <br>É obrigatório informar a <b>justificativa</b> para encaminhar o chamado!");
    }
}

// continuar com a logica de finalização para os agentes do chamado
