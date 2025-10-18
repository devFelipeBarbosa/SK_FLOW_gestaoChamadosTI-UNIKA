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
            return texto;
        }
    }

    if (!anexoTratado || typeof anexoTratado !== 'object') {
        return anexoTratado;
    }

    function extrairValor(obj, chaves) {
        for (var idx = 0; idx < chaves.length; idx++) {
            var chave = chaves[idx];
            if (obj.hasOwnProperty(chave)) {
                var valor = obj[chave];
                if (typeof valor === 'string' && valor.trim()) {
                    if (chave === 'binary' && valor === 'binary') {
                        continue;
                    }
                    return valor;
                }
            }
        }

        if (obj.file && typeof obj.file === 'object') {
            return extrairValor(obj.file, chaves);
        }

        return null;
    }

    function propagarValor(obj, chaves, valor) {
        if (!valor || valor === 'binary') {
            return;
        }

        for (var idx = 0; idx < chaves.length; idx++) {
            var chave = chaves[idx];
            if (!obj.hasOwnProperty(chave) || !obj[chave] || obj[chave] === 'binary') {
                obj[chave] = valor;
            }
        }
    }

    function atualizarCampo(obj, chaves, valor) {
        if (!valor) {
            return;
        }

        for (var idx = 0; idx < chaves.length; idx++) {
            var chave = chaves[idx];
            if (!obj.hasOwnProperty(chave) || !obj[chave] || obj[chave] === 'binary') {
                obj[chave] = valor;
            }
        }
    }

    var conteudo = extrairValor(anexoTratado, ['base64', 'conteudo', 'content', 'valor', 'value', 'binary']);
    if (conteudo) {
        propagarValor(anexoTratado, ['binary', 'base64', 'conteudo', 'content', 'valor', 'value'], conteudo);

        if (typeof anexoTratado.file === 'object') {
            propagarValor(anexoTratado.file, ['binary', 'base64', 'conteudo', 'content', 'valor', 'value'], conteudo);
        } else if (!anexoTratado.file || anexoTratado.file === 'binary') {
            anexoTratado.file = { binary: conteudo };
        }
    }

    var nome = extrairValor(anexoTratado, ['nomeArquivo', 'fileName', 'nome', 'name']);
    if (nome) {
        atualizarCampo(anexoTratado, ['nomeArquivo', 'fileName', 'nome', 'name'], nome);
        if (typeof anexoTratado.file === 'object') {
            atualizarCampo(anexoTratado.file, ['nomeArquivo', 'fileName', 'nome', 'name'], nome);
        }
    }

    var tipo = extrairValor(anexoTratado, ['tipoConteudo', 'contentType', 'tipo', 'type']);
    if (tipo) {
        propagarValor(anexoTratado, ['tipoConteudo', 'contentType', 'tipo', 'type'], tipo);
        if (typeof anexoTratado.file === 'object') {
            propagarValor(anexoTratado.file, ['tipoConteudo', 'contentType', 'tipo', 'type'], tipo);
        }
    }

    return anexoTratado;
}

function aplicarAnexo(linha, campo, valor) {
    var anexoFormatado = prepararAnexo(valor);
    if (anexoFormatado) {
        linha.setCampo(campo, anexoFormatado);
    }
}