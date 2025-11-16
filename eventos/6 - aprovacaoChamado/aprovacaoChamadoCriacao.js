// Aguardando Terceiro/Compra, Criação
var solicitacao = getIdInstanceProcesso(); // ID da Solicitação 
var codUsu = getUsuarioInclusao(); // ID do Usuário Solicitante 
var tabChamado = getLinhasFormulario("AD_CHAMADOTI"); // Retorna as linhas Tabela de Chamados TI (AD_CHAMADOTI)
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
    tabChamado[c].setCampo("CODUSUALTER", codUsu);
    tabChamado[c].setCampo("IDTAREFA", 'UserTask_0jnfn7w');
    tabChamado[c].setCampo("STATUSCHAMADO", 'F');
    tabChamado[c].setCampo("BLOQ_EXC_HIST", 'S'); // BLOQ_EXC_HIST
    tabChamado[c].setCampo("CICLO3", 'N');
    tabChamado[c].setCampo("JUSTIFICATIVASOLUCAO", '');
    tabChamado[c].setCampo("CICLO2", 'N'); // CICLO2 = 'N' para não permitir que o chamado seja fechado na próxima tarefa
    tabChamado[c].setCampo("JUSTIFICATIVACANC", ''); // JUSTIFICATIVACANC = '' para não permitir que o chamado seja cancelado na próxima tarefa

    try {
        salvarCamposAlterados();
    } catch (e) {
        console.error("Erro ao atualizar a solicitação na tabela de chamados TI: ", e);
        throw new Error("Erro ao <b>atualizar a solicitação na tabela de chamados TI</b>! <br>" + e.message);

    }
}