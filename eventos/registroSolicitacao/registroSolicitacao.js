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

function ehString(valor) {
    if (valor === null || valor === undefined) {
        return false;
    }

    if (typeof valor === 'string' || valor instanceof String) {
        return true;
    }

    if (typeof valor === 'object') {
        if (typeof valor.getClass === 'function') {
            try {
                var nomeClasse = valor.getClass().getName();

                if (nomeClasse && nomeClasse.indexOf('java.lang.String') !== -1) {
                    return true;
                }
            } catch (e) {
                // ignora erros ao tentar identificar o tipo Java
            }
        }

        var tag = Object.prototype.toString.call(valor);

        if (tag === '[object String]' || tag === '[object java.lang.String]') {
            return true;
        }
    }

    return false;
}

function normalizarEstrutura(valor) {
    if (valor === null || valor === undefined) {
        return null;
    }

    if (ehString(valor)) {
        var texto = String(valor).trim();

        if (!texto || texto === 'binary') {
            return null;
        }

        return texto;
    }

    var tipo = typeof valor;

    if (tipo === 'number' || tipo === 'boolean') {
        return valor;
    }

    if (Array.isArray(valor)) {
        var arrNormalizado = [];

        for (var i = 0; i < valor.length; i++) {
            var itemNormalizado = normalizarEstrutura(valor[i]);

            if (itemNormalizado !== null) {
                arrNormalizado.push(itemNormalizado);
            }
        }

        return arrNormalizado.length ? arrNormalizado : null;
    }

    if (tipo === 'object') {
        var objetoNormalizado = {};
        var possuiDados = false;

        for (var chave in valor) {
            var possuiPropriedade = true;

            try {
                possuiPropriedade = Object.prototype.hasOwnProperty.call(valor, chave);
            } catch (e) {
                // desconsidera erro ao verificar propriedades herdadas
            }

            if (!possuiPropriedade) {
                continue;
            }

            var valorNormalizado = normalizarEstrutura(valor[chave]);

            if (valorNormalizado !== null) {
                objetoNormalizado[chave] = valorNormalizado;
                possuiDados = true;
            }
        }

        return possuiDados ? objetoNormalizado : null;
    }

    return null;
}

function serializarAnexo(valor) {
    var normalizado = normalizarEstrutura(valor);

    if (normalizado === null) {
        return null;
    }

    if (typeof normalizado === 'string') {
        return normalizado;
    }

    try {
        return JSON.stringify(normalizado);
    } catch (e) {
        return null;
    }
}

function prepararAnexo(valor) {
    if (!valor) {
        return null;
    }

    if (typeof valor === 'string') {
        var texto = valor.trim();

        if (!texto || texto === 'binary') {
            return null;
        }

        try {
            var objeto = JSON.parse(texto);
            var serializado = serializarAnexo(objeto);

            if (serializado) {
                return serializado;
            }
        } catch (e) {
            // Mantém o texto original quando não for JSON válido.
        }

        return texto;
    }

    return serializarAnexo(valor);
}

function aplicarAnexo(linha, campo, valor) {
    var anexoPreparado = prepararAnexo(valor);

    if (anexoPreparado) {
        linha.setCampo(campo, anexoPreparado);
    }
}