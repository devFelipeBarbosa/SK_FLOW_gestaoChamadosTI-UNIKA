// Eem Atendimento, Alteração da Tabela (Salvar)
var solicitacao = getIdInstanceProcesso(); // ID da Solicitação 
var codUsu = getUsuarioInclusao(); // ID do Usuário Solicitante 
var tabChamado = getLinhasFormulario("AD_CHAMADOTI"); // Retorna as linhas Tabela de Chamados TI (AD_CHAMADOTI)
var linhaExistente = false; // Boleano para verificar existência de chamado TI para a solicitação 
var c = null; // tabela genérica para salvar o objeto da linha da tabela AD_CHAMADOTI, contador genérico para encontrar linha cadastro do Formulário

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
var descSolucaoAnterior = "Sem informações";

if (s >= 0) {
    descSolucaoAnterior = s.getCampo("DESCSOLUCAO");
}

if (salvaHistorico == "S" && descSolucao != descSolucaoAnterior) {
    var novaSolucao = novaLinhaFormulario("AD_HISTORICOSOLUCOES");
    novaSolucao.setCampo("CODREGISTRO", 1);
    novaSolucao.setCampo("IDTAREFA", "UserTask_1dsyzbu");
    novaSolucao.setCampo("TIPO", tipo);
    novaSolucao.setCampo("ID_CATEGORIATI", categoria);
    novaSolucao.setCampo("CODLOCAL", codLocal);
    novaSolucao.setCampo("DESCSOLUCAO", descSolucao);
    novaSolucao.setCampo("ID_PK", idCadastro);
    novaSolucao.setCampo("CODPROD", codProd);
    novaSolucao.setCampo("TERCEIRO", terceiro);
    novaSolucao.setCampo("DTTERCEIRO", dtTerceiro);
    novaSolucao.setCampo("CODPARC", codParc);
    novaSolucao.setCampo("DESCTERCEIRO", descTerceiro);

    try {
        novaSolucao.save();
    } catch (e) {
        console.error("Erro ao CRIAR a solução TI: ", e);
        throw new Error("Erro ao <b>CRIAR a solução TI</b>! <br>" + e.message);
    }

} else if (salvaHistorico == "S" && (s >= 0) && descSolucao == descSolucaoAnterior) {
    s.setCampo("CODREGISTRO", 1);
    s.setCampo("IDTAREFA", "UserTask_1dsyzbu");
    s.setCampo("TIPO", tipo);
    s.setCampo("ID_CATEGORIATI", categoria);
    s.setCampo("CODLOCAL", codLocal);
    s.setCampo("ID_PK", idCadastro);
    s.setCampo("CODPROD", codProd);
    s.setCampo("TERCEIRO", terceiro);
    s.setCampo("DTTERCEIRO", dtTerceiro);
    s.setCampo("CODPARC", codParc);
    s.setCampo("DESCTERCEIRO", descTerceiro);

    try {
        salvarCamposAlterados();
    } catch (e) {
        console.error("Erro ao ALTERAR a solução TI: ", e);
        throw new Error("Erro ao <b>ALTERAR a solução TI</b>! <br>" + e.message);
    }

}


try {
    salvarCamposAlterados();
} catch (e) {
    console.error("Erro ao ALTERAR a solução TI: ", e);
    throw new Error("Erro ao <b>ALTERAR a solução TI</b>! <br>" + e.message);
}