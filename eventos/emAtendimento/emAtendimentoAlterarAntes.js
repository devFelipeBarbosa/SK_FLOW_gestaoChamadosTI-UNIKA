// Eem Atendimento, Alteração da Tabela (Salvar)
var solicitacao = getIdInstanceProcesso(); // ID da Solicitação 
var codUsu = getUsuarioInclusao(); // ID do Usuário Solicitante 
var tabChamado = getLinhasFormulario("AD_CHAMADOTI"); // Retorna as linhas Tabela de Chamados TI (AD_CHAMADOTI)
var linhaExistente = false;
var c = null;
var listaId = [];

// Verifica se já existe uma linha na tabela de chamados TI para a solicitação atual 
for (var i = 0; i < tabChamado.length; i++) {
    if (tabChamado[i].getCampo("IDINSTPRN") == solicitacao) {
        linhaExistente = true;
        c = tabChamado[i];
        break;
    }
}

if (linhaExistente) {
    var codRequisitante = c.getCampo("CODUSU");
    var idCadastro = c.getCampo("ID_PK") || 0;
    var idEncontrado = null;
    var codProd = c.getCampo("CODPROD") || 0;
}

if (codProd != 0) {
    listaId = verificaDispositivo(codProd, solicitacao);
    idEncontrado = listaId[0].ID_PK;
}

if (listaId.length == 1 && idCadastro == 0) {
    c.setCampo("ID_PK", idEncontrado);

    try {
        salvarCamposAlterados();
    } catch (e) {
        console.error("Erro ao ALTERAR a solução TI: ", e);
        throw new Error("Erro ao <b>ALTERAR a solução TI</b>! <br>" + e.message);
    }
}
    
if (listaId.length > 1 && idCadastro == 0) {
       var listaIdsCodProd = listaId.map(function(item) {
        return "ID: " + item.ID_PK + " - CODPROD: " + item.CODPROD;
    }).join("<br>");

    throw new Error("Produto vinculado ao chamado TI tem mais de uma referência de cadastro, para prosseguir informe ao menos um deles:<br>" + listaIdsCodProd);
}

function verificaDispositivo(produto, idinstprn) {
    var lista = [];
    var id = null;
    var query = getQuery();
    query.setParam("CODPROD", produto);
    query.setParam("IDINSTPRN", idinstprn);
    query.nativeSelect("SELECT DIS.ID_PK, CAD.CODPROD FROM AD_CHAMADOTI CHA "
        + "INNER JOIN AD_EQUIPDISPCHAMADO DIS ON (DIS.IDINSTPRN = CHA.IDINSTPRN) "
        + "INNER JOIN AD_CADDISPOSITIVOSTI CAD ON (DIS.ID_PK = CAD.ID_PK AND CAD.CODPROD = CHA.CODPROD) "
        + "WHERE CHA.CODPROD = {CODPROD} AND CHA.IDINSTPRN = {IDINSTPRN}");

    try {
        while (query.next()) {
            id = parseInt(query.getString("ID_PK")) || null;
            if (id >= 0) {
                lista.push({ "ID_PK": id, "CODPROD": produto });
            }
        }
    } catch (e) {
        console.error("Erro ao executar a função verificaDispositivo: ", e);
        throw new Error("Erro ao <b>executar a função verificaDispositivo</b>! <br>" + e.message);
    }
    query.close();

    return lista.length > 0 ? lista : null;
}