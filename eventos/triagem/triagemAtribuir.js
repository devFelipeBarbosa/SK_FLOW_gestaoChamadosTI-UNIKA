// Ao Atribuir uma tarefa na triagem 
var solicitacao = getIdInstanceProcesso(); // ID da Solicitação 
var codUsu = getUsuarioInclusao(); // ID do Usuário Solicitante 
var tabChamado = getLinhasFormulario("AD_CHAMADOTI"); // Retorna as linhas Tabela de Chamados TI (AD_CHAMADOTI)
var tabDispositivos = getLinhasFormulario("AD_EQUIPDISPCHAMADO"); // Retorna as linhas Tabela de Dispositivos (AD_EQUIPDISPCHAMADO)
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

var novoDono = getNovoDono() || null;
var donoAnterior = getDonoAnterior() || null;

if (linhaExistente) {
    tabChamado[c].setCampo("CODUSUALTER", codUsu);
    tabChamado[c].setCampo("IDTAREFA", 'UserTask_1btj31b');

    if (donoAnterior == null || donoAnterior == '') {
        tabChamado[c].setCampo("STATUSCHAMADO", 'T'); // Atualiza o status do chamado TI para 'T' - Novo quando desatribuído a tarefa
    } else {
        tabChamado[c].setCampo("STATUSCHAMADO", 'N'); // Atualiza o status do chamado TI para 'N' - Em Triagem
    }

    try {
        salvarCamposAlterados();
    } catch (e) {
        console.error("Erro ao atualizar a solicitação na tabela de chamados TI: ", e);
        throw new Error("Erro ao <b>atualizar a solicitação na tabela de chamados TI</b>! <br>" + e.message);

    }

}



