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
var anexo1 = buscarDado("TEXTOLONGO", "TWFIVAR", "IDINSTPRN= :IDINSTPRN AND NOME= ANEXO1", [solicitacao]);
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

function ehObjeto(valor) {
    return valor !== null && typeof valor === 'object';
}

function extrairCaminhoRepositorio(anexo) {
    if (!ehObjeto(anexo)) {
        return null;
    }

    var caminhos = [];

    if (ehString(anexo.path)) {
        caminhos.push(String(anexo.path));
    }

    if (ehObjeto(anexo.file)) {
        if (ehString(anexo.file.path)) {
            caminhos.push(String(anexo.file.path));
        }

        if (ehString(anexo.file.url)) {
            caminhos.push(String(anexo.file.url));
        }
    }

    if (ehString(anexo.url)) {
        caminhos.push(String(anexo.url));
    }

    for (var i = 0; i < caminhos.length; i++) {
        var caminho = caminhos[i];

        if (caminho && caminho.indexOf('Repo://') === 0) {
            return caminho;
        }
    }

    return null;
}

function lerStreamComoBase64(stream) {
    if (!stream) {
        return null;
    }

    var ByteArrayOutputStream = Packages.java.io.ByteArrayOutputStream;
    var baos = new ByteArrayOutputStream();
    var buffer = Packages.java.lang.reflect.Array.newInstance(Packages.java.lang.Byte.TYPE, 8192);
    var bytesLidos = 0;

    try {
        while ((bytesLidos = stream.read(buffer)) !== -1) {
            baos.write(buffer, 0, bytesLidos);
        }
    } finally {
        try {
            stream.close();
        } catch (e) {
            // ignora erros ao fechar o stream
        }
    }

    var dados = baos.toByteArray();

    if (!dados || dados.length === 0) {
        return null;
    }

    try {
        var Base64 = Packages.java.util.Base64;
        var encoder = Base64.getEncoder();

        return String(encoder.encodeToString(dados));
    } catch (e) {
        return null;
    }
}

function tentarAbrirStreamViaUrl(caminho) {
    if (!caminho) {
        return null;
    }

    try {
        var URL = Packages.java.net.URL;
        var url = new URL(caminho);

        return url.openStream();
    } catch (e) {
        return null;
    }
}

function tentarAbrirStreamViaRepositorio(caminho) {
    var candidatos = [];

    try {
        var RepositoryManager = Packages.br.com.sankhya.util.RepositoryManager;

        if (RepositoryManager && typeof RepositoryManager.getInstance === 'function') {
            var instancia = RepositoryManager.getInstance();

            if (instancia && typeof instancia.getInputStream === 'function') {
                candidatos.push({
                    instancia: instancia,
                    metodo: 'getInputStream'
                });
            }
        }
    } catch (e) {
        // ignora quando a classe não estiver disponível
    }

    try {
        var RepoHelper = Packages.br.com.sankhya.util.RepositoryHelper;

        if (RepoHelper) {
            if (typeof RepoHelper.getInputStream === 'function') {
                candidatos.push({
                    instancia: RepoHelper,
                    metodo: 'getInputStream'
                });
            } else if (typeof RepoHelper.getStream === 'function') {
                candidatos.push({
                    instancia: RepoHelper,
                    metodo: 'getStream'
                });
            }
        }
    } catch (e) {
        // ignora indisponibilidades
    }

    for (var i = 0; i < candidatos.length; i++) {
        var candidato = candidatos[i];

        try {
            var metodo = candidato.instancia[candidato.metodo];

            if (typeof metodo === 'function') {
                var stream = metodo.call(candidato.instancia, caminho);

                if (stream) {
                    return stream;
                }
            }
        } catch (e) {
            // tenta próximo candidato
        }
    }

    return null;
}

function tentarAbrirStreamViaArquivoFisico(caminho) {
    if (!caminho || caminho.indexOf('Repo://') !== 0) {
        return null;
    }

    var caminhoRelativo = caminho.substring('Repo://'.length);

    if (!caminhoRelativo) {
        return null;
    }

    var substituicoes = [];

    try {
        var System = Packages.java.lang.System;
        var dataDir = System.getProperty('jboss.server.data.dir');
        var sankhyaHome = System.getProperty('sankhya.home');
        var userDir = System.getProperty('user.dir');

        if (dataDir) {
            substituicoes.push(dataDir + Packages.java.io.File.separator + 'Repository');
            substituicoes.push(dataDir + Packages.java.io.File.separator + 'repository');
            substituicoes.push(dataDir + Packages.java.io.File.separator + 'repositorio');
        }

        if (sankhyaHome) {
            substituicoes.push(sankhyaHome + Packages.java.io.File.separator + 'Repository');
            substituicoes.push(sankhyaHome + Packages.java.io.File.separator + 'repository');
            substituicoes.push(sankhyaHome + Packages.java.io.File.separator + 'repositorio');
        }

        if (userDir) {
            substituicoes.push(userDir + Packages.java.io.File.separator + 'Repository');
            substituicoes.push(userDir + Packages.java.io.File.separator + 'repository');
        }
    } catch (e) {
        // ignora impossibilidade de acessar propriedades do sistema
    }

    substituicoes.push('');

    for (var i = 0; i < substituicoes.length; i++) {
        try {
            var base = substituicoes[i];
            var File = Packages.java.io.File;
            var arquivo = base ? new File(base, caminhoRelativo) : new File(caminhoRelativo);

            if (arquivo.exists() && arquivo.isFile()) {
                return new Packages.java.io.FileInputStream(arquivo);
            }
        } catch (e) {
            // tenta próximo caminho
        }
    }

    return null;
}

function carregarBase64DoRepositorio(caminho) {
    if (!caminho) {
        return null;
    }

    var stream = tentarAbrirStreamViaUrl(caminho);

    if (!stream) {
        stream = tentarAbrirStreamViaRepositorio(caminho);
    }

    if (!stream) {
        stream = tentarAbrirStreamViaArquivoFisico(caminho);
    }

    if (!stream) {
        return null;
    }

    return lerStreamComoBase64(stream);
}

function extrairConteudoExistente(anexo) {
    if (!ehObjeto(anexo)) {
        return null;
    }

    var candidatos = [];

    var campos = ['binary', 'base64', 'conteudo', 'content'];

    for (var i = 0; i < campos.length; i++) {
        var chave = campos[i];

        if (ehString(anexo[chave])) {
            candidatos.push(String(anexo[chave]));
        }
    }

    if (ehObjeto(anexo.file)) {
        for (var chaveFile in anexo.file) {
            if (!Object.prototype.hasOwnProperty.call(anexo.file, chaveFile)) {
                continue;
            }

            if (ehString(anexo.file[chaveFile])) {
                candidatos.push(String(anexo.file[chaveFile]));
            }
        }
    }

    if (ehString(anexo.uri)) {
        candidatos.push(String(anexo.uri));
    }

    if (ehString(anexo.url)) {
        candidatos.push(String(anexo.url));
    }

    for (var j = 0; j < candidatos.length; j++) {
        var candidato = candidatos[j];

        if (!candidato) {
            continue;
        }

        var texto = candidato.trim();

        if (!texto || texto === 'binary') {
            continue;
        }

        var indiceBase64 = texto.indexOf('base64,');

        if (indiceBase64 !== -1) {
            return texto.substring(indiceBase64 + 'base64,'.length);
        }

        if (texto.indexOf('Repo://') === 0) {
            continue;
        }

        return texto;
    }

    return null;
}

function calcularTamanhoBase64(base64) {
    if (!ehString(base64)) {
        return null;
    }

    var texto = base64.trim();

    if (!texto) {
        return null;
    }

    var comprimento = texto.length;
    var padding = 0;

    if (texto.endsWith('==')) {
        padding = 2;
    } else if (texto.endsWith('=')) {
        padding = 1;
    }

    return Math.floor((comprimento * 3) / 4) - padding;
}

function montarDataUri(base64, tipo) {
    var mime = (ehString(tipo) && tipo.trim()) ? tipo.trim() : 'application/octet-stream';

    return 'data:' + mime + ';base64,' + base64;
}

function completarConteudoDoAnexo(anexo) {
    if (!ehObjeto(anexo)) {
        return anexo;
    }

    var conteudoExistente = extrairConteudoExistente(anexo);

    if (!conteudoExistente) {
        var caminho = extrairCaminhoRepositorio(anexo);

        if (caminho) {
            var base64 = carregarBase64DoRepositorio(caminho);

            if (base64) {
                if (!ehObjeto(anexo.file)) {
                    anexo.file = {};
                }

                anexo.file.binary = base64;
                anexo.file.base64 = base64;
                anexo.file.uri = montarDataUri(base64, anexo.type || (anexo.file && anexo.file.type));

                if (anexo.file && !ehString(anexo.file.name) && ehString(anexo.name)) {
                    anexo.file.name = String(anexo.name);
                } else if (!ehString(anexo.name) && ehString(anexo.file.name)) {
                    anexo.name = String(anexo.file.name);
                }

                if (ehString(anexo.type)) {
                    anexo.file.type = String(anexo.type);
                } else if (ehString(anexo.file.type)) {
                    anexo.type = String(anexo.file.type);
                }

                var tamanho = calcularTamanhoBase64(base64);

                if (tamanho !== null) {
                    anexo.size = tamanho;
                    anexo.file.size = tamanho;
                }

                conteudoExistente = base64;
            }
        }
    }

    if (conteudoExistente) {
        if (!ehObjeto(anexo.file)) {
            anexo.file = {};
        }

        if (!ehString(anexo.file.binary) || anexo.file.binary.trim() === '' || anexo.file.binary.trim() === 'binary') {
            anexo.file.binary = conteudoExistente;
        }

        if (!ehString(anexo.file.uri) || anexo.file.uri.trim() === '') {
            anexo.file.uri = montarDataUri(conteudoExistente, anexo.type || (anexo.file && anexo.file.type));
        }

        if (!ehString(anexo.binary) || anexo.binary.trim() === '' || anexo.binary.trim() === 'binary') {
            anexo.binary = conteudoExistente;
        }

        if (!ehString(anexo.base64) || anexo.base64.trim() === '') {
            anexo.base64 = conteudoExistente;
        }
    }

    return anexo;
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

    var objeto = null;

    if (ehString(valor)) {
        var texto = String(valor).trim();

        if (!texto || texto === 'binary') {
            return null;
        }

        if (texto.charAt(0) === '{' || texto.charAt(0) === '[') {
            try {
                objeto = JSON.parse(texto);
            } catch (e) {
                return texto;
            }
        } else {
            return texto;
        }
    } else if (ehObjeto(valor)) {
        objeto = valor;
    }

    if (objeto) {
        var objetoComConteudo = completarConteudoDoAnexo(objeto);

        return serializarAnexo(objetoComConteudo);
    }

    return serializarAnexo(valor);
}

function aplicarAnexo(linha, campo, valor) {
    var anexoPreparado = prepararAnexo(valor);

    if (anexoPreparado) {
        linha.setCampo(campo, anexoPreparado);
    }
}
