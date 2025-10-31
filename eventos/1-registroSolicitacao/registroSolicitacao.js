// Registro da Solicitação - na tabela AD_CHAMADOTI (INICIALIZACÃO) 
var solicitacao = getIdInstanceProcesso(); // ID da Solicitação 
var codUsu = getUsuarioInclusao(); // ID do Usuário Solicitante 
var tabChamado = getLinhasFormulario("AD_CHAMADOTI"); // Retorna as linhas Tabela de Chamados TI (AD_CHAMADOTI)
var tabDispositivos = getLinhasFormulario("AD_EQUIPDISPCHAMADO"); // Retorna as linhas Tabela de Dispositivos (AD_EQUIPDISPCHAMADO)
var linhaExistente = false; // Boleano para verificar existência de chamado TI para a solicitação 
var c = null; // contador genérico para encontrar linha cadastro do Formulário

// Campos do Formulário Embarcado 
var tipo = getCampo("TIPO") || 'I';
var codLocal = getCampo("CODLOCAL") || Number(0);
var categoria = getCampo("CATEGORIA") || Number(0);
var urgencia = getCampo("URGENCIA") || Number(0);
var titulo = getCampo("TITULO") || '';
var descricao = getCampo("TEXTOCHAMADO") || '';
var anexo1 = getCampo("ANEXO1");
var anexo2 = getCampo("ANEXO2");
var anexo3 = getCampo("ANEXO3");


// Verifica se já existe uma linha na tabela de chamados TI para a solicitação atual 
for (var i = 0; i < tabChamado.length; i++) {
    if (tabChamado[i].getCampo("IDINSTPRN") == solicitacao) {
        linhaExistente = true;
        c = i;
        break;
    }
}

if (!linhaExistente) {
    var novaLinhaTabChamado = novaLinhaFormulario("AD_CHAMADOTI");
    novaLinhaTabChamado.setCampo("IDTAREFA", 'UserTask_0j1hb5e');
    novaLinhaTabChamado.setCampo("CODUSU", codUsu);
    novaLinhaTabChamado.setCampo("TIPO", tipo);
    novaLinhaTabChamado.setCampo("ID_CATEGORIATI", categoria);
    novaLinhaTabChamado.setCampo("CODLOCAL", codLocal);
    novaLinhaTabChamado.setCampo("TITULO", titulo);
    novaLinhaTabChamado.setCampo("TEXTOCHAMADO", descricao);
    novaLinhaTabChamado.setCampo("STATUSCHAMADO", 'N');
    novaLinhaTabChamado.setCampo("ORIGEMCHAMADO", 'F');
    novaLinhaTabChamado.setCampo("URGENCIA", urgencia);
    novaLinhaTabChamado.setCampo("IMPACTO", urgencia); // regra de negócio inicial: Impacto igual Urgência 
    novaLinhaTabChamado.setCampo("PRIORIDADE", 'M');

    if (anexo1) {
        novaLinhaTabChamado.setCampo("ANEXO1", anexo1);
    }
    if (anexo2) {
        novaLinhaTabChamado.setCampo("ANEXO2", anexo2);
    }
    if (anexo3) {
        novaLinhaTabChamado.setCampo("ANEXO3", anexo3);
    }

    novaLinhaTabChamado.setCampo("CICLO1", 'NA'); // regra de negócio inicial: CICLO1 inicial igual a NA 
    novaLinhaTabChamado.setCampo("CODUSUALTER", codUsu);
    novaLinhaTabChamado.setCampo("TERCEIRO", 'NA'); // TERCEIRO regra do negócio: igual a NA no inicio 
    novaLinhaTabChamado.setCampo("STATUSTERCEIRO", 'NA'); // STATUSTERCEIRO regra do negócio: igual a NA no inicio 
    novaLinhaTabChamado.setCampo("CICLO2", 'N'); // CICLO2 regra do negócio: igual a N no inicio 
    novaLinhaTabChamado.setCampo("CICLO3", 'NA'); // CICLO3 regra do negócio: igual a NA no inicio CLICO3 
    novaLinhaTabChamado.setCampo("AVALIACAO", '0'); // AVALIACAO regra do negócio: igual a 0 (texto) no inicio 
    novaLinhaTabChamado.setCampo("USADISPOSITIVO", 'N'); // USADISPOSITIVO regra do negócio: igual a N no inicio USADISPOSITIVO
    novaLinhaTabChamado.setCampo("SALVASOLUCAO", 'S');
    novaLinhaTabChamado.setCampo("BASECONHECIMENTO", 'S');
    novaLinhaTabChamado.setCampo("BLOQ_EXC_HIST", 'N'); // BLOQ_EXC_HIST regra do negócio: igual a N no inicio


    try {
        novaLinhaTabChamado.save();
    } catch (e) {
        console.error("Erro ao CRIAR o chamado TI: ", e);
        throw new Error("Erro ao <b>CRIAR o chamado TI</b>! <br>" + e.message);
    }

} else {

    tabChamado[c].setCampo("CODUSU", codUsu);
    tabChamado[c].setCampo("TIPO", tipo);
    tabChamado[c].setCampo("ID_CATEGORIATI", categoria);
    tabChamado[c].setCampo("CODLOCAL", codLocal);
    tabChamado[c].setCampo("TITULO", titulo);
    tabChamado[c].setCampo("TEXTOCHAMADO", descricao);
    tabChamado[c].setCampo("STATUSCHAMADO", 'N');
    tabChamado[c].setCampo("ORIGEMCHAMADO", 'F');
    tabChamado[c].setCampo("URGENCIA", urgencia);
    tabChamado[c].setCampo("IMPACTO", urgencia); // regra de negócio inicial: Impacto igual Urgência 
    tabChamado[c].setCampo("PRIORIDADE", 'M');

    if (anexo1) {
        tabChamado[c].setCampo("ANEXO1", anexo1);
    }
    if (anexo2) {
        tabChamado[c].setCampo("ANEXO2", anexo2);
    }
    if (anexo3) {
        tabChamado[c].setCampo("ANEXO3", anexo3);
    }

    tabChamado[c].setCampo("CICLO1", 'NA'); // regra de negócio inicial: CICLO1 inicial igual a NA 
    tabChamado[c].setCampo("CODUSUALTER", codUsu);
    tabChamado[c].setCampo("TERCEIRO", 'NA'); // TERCEIRO regra do negócio: igual a NA no inicio 
    tabChamado[c].setCampo("STATUSTERCEIRO", 'NA'); // STATUSTERCEIRO regra do negócio: igual a NA no inicio 
    tabChamado[c].setCampo("CICLO2", 'N'); // CICLO2 regra do negócio: igual a N no inicio 
    tabChamado[c].setCampo("CICLO3", 'NA'); // CICLO3 regra do negócio: igual a NA no inicio CLICO3 
    tabChamado[c].setCampo("AVALIACAO", 0); // AVALIACAO regra do negócio: igual a 0 (texto) no inicio
    tabChamado[c].setCampo("USADISPOSITIVO", 'N'); // USADISPOSITIVO regra do negócio: igual a N no inicio USADISPOSITIVO    
    tabChamado[c].setCampo("SALVASOLUCAO", 'S');
    tabChamado[c].setCampo("BASECONHECIMENTO", 'S');
    tabChamado[c].setCampo("BLOQ_EXC_HIST", 'N'); // BLOQ_EXC_HIST regra do negócio: igual a N no inicio

    try {
        salvarCamposAlterados();
    } catch (e) {
        console.error("Erro ao atualizar a solicitação na tabela de chamados TI: ", e);
        throw new Error("Erro ao <b>atualizar a solicitação na tabela de chamados TI</b>! <br>" + e.message);

    }
}

// A partir desse ponto trataremos os dispositivos vinculados ao chamado TI
var listaDispositivosAtuais = listarDispositivosUsuario(codUsu) || null; // Lista de dispositivos atuais do usuário em uso (U) ou em manutenção (M), TABELA AD_CADDISPOSITIVOSTI
var temDispositivoVinculado = false; // Boleano para verificar se já existe dispositivo vinculado ao chamado TI
var listaDispositivosChamado = buscarDado("ID_PK", "AD_EQUIPDISPCHAMADO", "IDINSTPRN= :IDINSTPRN", [solicitacao]) || null; // busca ao menos um dipositivo vinculado ao chamado TI

if (listaDispositivosChamado != null) {
    temDispositivoVinculado = true;
}

if (!temDispositivoVinculado && listaDispositivosAtuais != null) {

    // Percorre a lista de dispositivos atuais do usuário
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