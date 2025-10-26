// Eem Atendimento, Alteração da Tabela (Salvar)
var solicitacao = getIdInstanceProcesso(); // ID da Solicitação 
var codUsu = getUsuarioInclusao(); // ID do Usuário Solicitante 
var tabChamado = getLinhasFormulario("AD_CHAMADOTI"); // Retorna as linhas Tabela de Chamados TI (AD_CHAMADOTI)
var linhaExistente = false;
var c = null;

// Verifica se já existe uma linha na tabela de chamados TI para a solicitação atual 
for (var i = 0; i < tabChamado.length; i++) {
    if (tabChamado[i].getCampo("IDINSTPRN") == solicitacao) {
        linhaExistente = true;
        c = tabChamado[i];
        break;
    }
}

if (linhaExistente) {

    var tipo = c.getCampo("TIPO");
    var categoria = c.getCampo("ID_CATEGORIATI");
    var codLocal = c.getCampo("CODLOCAL");
    var descSolucao = c.getCampo("DESCSOLUCAO") || null;
    var idCadastro = c.getCampo("ID_PK");
    var codProd = c.getCampo("CODPROD");
    var terceiro = c.getCampo("TERCEIRO");
    var dtTerceiro = c.getCampo("DTTERCEIRO");
    var codParc = c.getCampo("CODPARC");
    var descTerceiro = c.getCampo("DESCTERCEIRO");
    var salvaHistorico = c.getCampo("SALVASOLUCAO") || "S";
}

//aqui eu preciso pegar a ultima linha da tabela AD_HISTORICOSOLUCOES para comparar com a linha c da tabela AD_CHAMADOTI
var tabHistoricoSoluceos = getLinhasFormulario("AD_HISTORICOSOLUCOES"); // Retorna as linhas Tabela de Histórico de Soluções (AD_HISTORICOSOLUCOES)
var s = tabHistoricoSoluceos[tabHistoricoSoluceos.length - 1]; // ultima linha da tabela AD_HISTORICOSOLUCOES
var descSolucaoAnterior = null;

if ((tabHistoricoSoluceos.length - 1) >= 0) {
    descSolucaoAnterior = s.getCampo("DESCSOLUCAO");
}

if (salvaHistorico == "S" && descSolucao != descSolucaoAnterior) { // Cria uma nova linha na tabela AD_HISTORICOSOLUCOES

    var novaSolucao = novaLinhaFormulario("AD_HISTORICOSOLUCOES");
    setaCampos(novaSolucao, tipo, categoria, codLocal, descSolucao, idCadastro, codProd, terceiro, dtTerceiro, codParc, descTerceiro);
    try {
        novaSolucao.save();
    } catch (e) {
        console.error("Erro ao CRIAR a solução TI: ", e);
        throw new Error("Erro ao <b>CRIAR a solução TI</b>! <br>" + e.message);
    }

} else if (salvaHistorico == "S" && (tabHistoricoSoluceos.length - 1) >= 0 && descSolucao == descSolucaoAnterior) { // Não cria uma nova linha na tabela AD_HISTORICOSOLUCOES, update
    
    setaCampos(s, tipo, categoria, codLocal, descSolucao, idCadastro, codProd, terceiro, dtTerceiro, codParc, descTerceiro);
    try {
        salvarCamposAlterados();
    } catch (e) {
        console.error("Erro ao ALTERAR a solução TI: ", e);
        throw new Error("Erro ao <b>ALTERAR a solução TI</b>! <br>" + e.message);
    }
} 
function setaCampos(solucao, tipo, categoria, codLocal, descSolucao, idCadastro, codProd, terceiro, dtTerceiro, codParc, descTerceiro) {
    solucao.setCampo("CODREGISTRO", 1);
    solucao.setCampo("IDTAREFA", "UserTask_1dsyzbu");
    solucao.setCampo("TIPO", tipo);
    solucao.setCampo("ID_CATEGORIATI", categoria);
    solucao.setCampo("CODLOCAL", codLocal);
    solucao.setCampo("DESCSOLUCAO", descSolucao);
    solucao.setCampo("ID_PK", idCadastro);
    solucao.setCampo("CODPROD", codProd);
    solucao.setCampo("TERCEIRO", terceiro);
    solucao.setCampo("DTTERCEIRO", dtTerceiro);
    solucao.setCampo("CODPARC", codParc);
    solucao.setCampo("DESCTERCEIRO", descTerceiro);
}