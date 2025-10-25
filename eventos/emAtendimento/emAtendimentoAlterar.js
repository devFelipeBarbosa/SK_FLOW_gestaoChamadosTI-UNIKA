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
    var descSolucao = c.getCampo("DESCSOLUCAO");
    var idCadastro = c.getCampo("ID_PK");
    var codProd = c.getCampo("CODPROD");
    var terceiro = c.getCampo("TERCEIRO");
    var dtTerceiro = c.getCampo("DTTERCEIRO");
    var codParc = c.getCampo("CODPARC");
    var descTerceiro = c.getCampo("DESCTERCEIRO");
}

//aqui eu preciso pegar a ultima linha da tabela AD_HISTORICOSOLUCOES para comparar com a linha c da tabela AD_CHAMADOTI
var tabHistoricoSoluceos = getLinhasFormulario("AD_HISTORICOSOLUCOES"); // Retorna as linhas Tabela de Histórico de Soluções (AD_HISTORICOSOLUCOES)
var s = tabHistoricoSoluceos[tabHistoricoSoluceos.length - 1]; // ultima linha da tabela AD_HISTORICOSOLUCOES

if (s == null || s == undefined) {
    var novaSolucao = novaLinhaFormulario("AD_HISTORICOSOLUCOES");
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
        console.error("Erro ao CRIAR o chamado TI: ", e);
        throw new Error("Erro ao <b>CRIAR o chamado TI</b>! <br>" + e.message);
    }

} else {

    var descSolucaoAnterior = s.getCampo("DESCSOLUCAO");
    var idCadastroAnterior = s.getCampo("ID_PK");
    var codProdAnterior = s.getCampo("CODPROD");
    var terceiroAnterior = s.getCampo("TERCEIRO");
    var dtTerceiroAnterior = s.getCampo("DTTERCEIRO");
    var codParcAnterior = s.getCampo("CODPARC");
    var descTerceiroAnterior = s.getCampo("DESCTERCEIRO");

    if(descSolucao != descSolucaoAnterior || idCadastro != idCadastroAnterior || codProd != codProdAnterior || terceiro != terceiroAnterior || dtTerceiro != dtTerceiroAnterior || codParc != codParcAnterior || descTerceiro != descTerceiroAnterior){

        var novaSolucao = novaLinhaFormulario("AD_HISTORICOSOLUCOES");
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
            console.error("Erro ao CRIAR o chamado TI: ", e);
            throw new Error("Erro ao <b>CRIAR o chamado TI</b>! <br>" + e.message);
        }
    }
}