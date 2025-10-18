// Registro da Solicitação - na tabela AD_CHAMADOTI (INICIALIZACÃO) 
var solicitacao = getIdInstanceProcesso(); // ID da Solicitação 
var codUsu = getUsuarioInclusao(); // ID do Usuário Solicitante 
var tabChamado = getLinhasFormulario("AD_CHAMADOTI"); // Retorna as linhas Tabela de Chamados TI 
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

function prepararAnexo(anexo) {
    if (!anexo) {
        return null;
    }

    var anexoTratado = anexo;

    if (typeof anexoTratado === 'string') {
        var texto = anexoTratado.trim();
        if (!texto) {
            return null;
        }

        try {
            anexoTratado = JSON.parse(texto);
        } catch (e) {
            return {
                file: texto,
                conteudo: texto,
                value: texto,
                fileName: 'anexo',
                nomeArquivo: 'anexo',
                contentType: 'application/octet-stream',
                tipoConteudo: 'application/octet-stream'
            };
        }
    }

    if (!anexoTratado || typeof anexoTratado !== 'object') {
        return null;
    }

    function obterConteudo(obj) {
        if (typeof obj === 'string') {
            return obj.trim() ? obj : null;
        }

        var camposPossiveis = ['base64', 'conteudo', 'content', 'valor', 'value', 'binary'];
        for (var idx = 0; idx < camposPossiveis.length; idx++) {
            var chave = camposPossiveis[idx];
            if (obj.hasOwnProperty(chave)) {
                var valor = obj[chave];
                if (typeof valor === 'string' && valor.trim()) {
                    return valor;
                }
            }
        }

        if (obj.file) {
            if (typeof obj.file === 'string' && obj.file.trim()) {
                return obj.file;
            }

            if (typeof obj.file === 'object') {
                return obterConteudo(obj.file);
            }
        }

        return null;
    }

    var conteudo = obterConteudo(anexoTratado);
    if (!conteudo) {
        return null;
    }

    function obterNome(obj) {
        var camposNome = ['nomeArquivo', 'nome', 'name', 'fileName'];
        for (var iNome = 0; iNome < camposNome.length; iNome++) {
            var chaveNome = camposNome[iNome];
            if (obj.hasOwnProperty(chaveNome) && obj[chaveNome]) {
                return obj[chaveNome];
            }
        }

        if (obj.file && typeof obj.file === 'object') {
            return obterNome(obj.file);
        }

        return null;
    }

    var nome = obterNome(anexoTratado) || 'anexo';

    function obterTipo(obj) {
        var camposTipo = ['tipoConteudo', 'contentType', 'tipo', 'type'];
        for (var iTipo = 0; iTipo < camposTipo.length; iTipo++) {
            var chaveTipo = camposTipo[iTipo];
            if (obj.hasOwnProperty(chaveTipo) && obj[chaveTipo]) {
                return obj[chaveTipo];
            }
        }

        if (obj.file && typeof obj.file === 'object') {
            return obterTipo(obj.file);
        }

        return null;
    }

    var tipo = obterTipo(anexoTratado) || 'application/octet-stream';

    return {
        file: conteudo,
        conteudo: conteudo,
        value: conteudo,
        binary: conteudo,
        fileName: nome,
        nomeArquivo: nome,
        contentType: tipo,
        tipoConteudo: tipo
    };
}

function aplicarAnexo(linha, campo, valor) {
    var anexoFormatado = prepararAnexo(valor);
    if (anexoFormatado) {
        linha.setCampo(campo, anexoFormatado);
    }
}

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

    aplicarAnexo(novaLinhaTabChamado, "ANEXO1", anexo1);
    aplicarAnexo(novaLinhaTabChamado, "ANEXO2", anexo2);
    aplicarAnexo(novaLinhaTabChamado, "ANEXO3", anexo3);

    novaLinhaTabChamado.setCampo("CICLO1", 'NA'); // regra de negócio inicial: CICLO1 inicial igual a NA 
    novaLinhaTabChamado.setCampo("CODUSUALTER", codUsu);
    novaLinhaTabChamado.setCampo("TERCEIRO", 'NA'); // TERCEIRO regra do negócio: igual a NA no inicio 
    novaLinhaTabChamado.setCampo("STATUSTERCEIRO", 'NA'); // STATUSTERCEIRO regra do negócio: igual a NA no inicio 
    novaLinhaTabChamado.setCampo("CICLO2", 'N'); // CICLO2 regra do negócio: igual a N no inicio 
    novaLinhaTabChamado.setCampo("CICLO3", 'NA'); // CICLO3 regra do negócio: igual a NA no inicio CLICO3 
    novaLinhaTabChamado.setCampo("AVALIACAO", '0'); // AVALIACAO regra do negócio: igual a 0 (texto) no inicio 

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

    aplicarAnexo(tabChamado[c], "ANEXO1", anexo1);
    aplicarAnexo(tabChamado[c], "ANEXO2", anexo2);
    aplicarAnexo(tabChamado[c], "ANEXO3", anexo3);

    tabChamado[c].setCampo("CICLO1", 'NA'); // regra de negócio inicial: CICLO1 inicial igual a NA 
    tabChamado[c].setCampo("CODUSUALTER", codUsu);
    tabChamado[c].setCampo("TERCEIRO", 'NA'); // TERCEIRO regra do negócio: igual a NA no inicio 
    tabChamado[c].setCampo("STATUSTERCEIRO", 'NA'); // STATUSTERCEIRO regra do negócio: igual a NA no inicio 
    tabChamado[c].setCampo("CICLO2", 'N'); // CICLO2 regra do negócio: igual a N no inicio 
    tabChamado[c].setCampo("CICLO3", 'NA'); // CICLO3 regra do negócio: igual a NA no inicio CLICO3 
    tabChamado[c].setCampo("AVALIACAO", 0); // AVALIACAO regra do negócio: igual a 0 (texto) no inicio     
    
    try {
        salvarCamposAlterados();
    } catch (e) {
        console.error("Erro ao atualizar a solicitação na tabela de chamados TI: ", e);
        throw new Error("Erro ao <b>atualizar a solicitação na tabela de chamados TI</b>! <br>" + e.message);

    }

}

