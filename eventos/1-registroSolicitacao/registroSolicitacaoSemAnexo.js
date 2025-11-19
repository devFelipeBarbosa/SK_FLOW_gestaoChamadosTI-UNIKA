// Registro da Solicitação - na tabela AD_CHAMADOTI (INICIALIZACÃO) 
var solicitacao = getIdInstanceProcesso();
var codUsu = getUsuarioInclusao(); 
var tabChamado = getLinhasFormulario("AD_CHAMADOTI");
var tabDispositivos = getLinhasFormulario("AD_EQUIPDISPCHAMADO"); 
var linhaExistente = false, c = null; 

for (var i = 0; i < tabChamado.length; i++) {
    if (tabChamado[i].getCampo("IDINSTPRN") == solicitacao) {
        linhaExistente = true;
        c = i;
        break;
    }
}

if (linhaExistente) {
    tabChamado[c].setCampo("CODUSU", codUsu);
    tabChamado[c].setCampo("STATUSCHAMADO", 'N');
    tabChamado[c].setCampo("ORIGEMCHAMADO", 'F');
    tabChamado[c].setCampo("IMPACTO", 'M');
    tabChamado[c].setCampo("PRIORIDADE", 'M');
    tabChamado[c].setCampo("CICLO1", 'NA');
    tabChamado[c].setCampo("CODUSUALTER", codUsu);
    tabChamado[c].setCampo("TERCEIRO", 'NA');
    tabChamado[c].setCampo("STATUSTERCEIRO", 'NA'); 
    tabChamado[c].setCampo("CICLO2", 'N');
    tabChamado[c].setCampo("CICLO3", 'NA');
    tabChamado[c].setCampo("AVALIACAO", 0);
    tabChamado[c].setCampo("USADISPOSITIVO", 'N');    
    tabChamado[c].setCampo("SALVASOLUCAO", 'S');
    tabChamado[c].setCampo("BASECONHECIMENTO", 'S');
    tabChamado[c].setCampo("BLOQ_EXC_HIST", 'N');

    try {
        salvarCamposAlterados();
    } catch (e) {
        console.error("Erro ao atualizar a solicitação na tabela de chamados TI: ", e);
        throw new Error("Erro ao <b>atualizar a solicitação na tabela de chamados TI</b>! <br>" + e.message);

    }
}

var listaDispositivosAtuais = listarDispositivosUsuario(codUsu) || null; 
var temDispositivoVinculado = false;
var listaDispositivosChamado = buscarDado("ID_PK", "AD_EQUIPDISPCHAMADO", "IDINSTPRN= :IDINSTPRN", [solicitacao]) || null;

if (listaDispositivosChamado != null) {
    temDispositivoVinculado = true;
}

if (!temDispositivoVinculado && listaDispositivosAtuais != null) {

    for (var j = 0; j < listaDispositivosAtuais.length; j++) {

        var novaLinhaDispositivoChamado = novaLinhaFormulario("AD_EQUIPDISPCHAMADO");
        novaLinhaDispositivoChamado.setCampo("CODREGISTRO", 1);
        novaLinhaDispositivoChamado.setCampo("IDTAREFA", 'UserTask_0j1hb5e');
        novaLinhaDispositivoChamado.setCampo("ID_PK", listaDispositivosAtuais[j].ID_PK);

        try {
            novaLinhaDispositivoChamado.save();
        } catch (e) {
            console.error("Erro ao vincular dispositivo ao chamado TI: ", e);
            throw new Error("Erro ao <b>vincular dispositivo ao chamado TI</b>! <br>" + e.message);
        }
    }
}

function listarDispositivosUsuario(codUsu) {

    var listaAtual = [];
    var listaQuery = getQuery();
    listaQuery.setParam("CODUSU", codUsu);
    listaQuery.nativeSelect("SELECT ID_PK FROM AD_CADDISPOSITIVOSTI WHERE CODUSU = {CODUSU} AND STATUSUSO IN ('U','M')");

    try {
        while (listaQuery.next()) {
            var dispositivo = parseInt(listaQuery.getString("ID_PK"));
            listaAtual.push({ "ID_PK": dispositivo });
        }
    } catch (e) {
        console.error("Erro ao executar a função listarDispositivosUsuario: ", e);
        throw new Error("Erro ao <b>executar a função listarDispositivosUsuario</b>! <br>" + e.message);

    }

    listaQuery.close();

    return listaAtual.length > 0 ? listaAtual : null;
}
