// EVENTO DE AÇÃO: Finalizar Triagem e Salvar Lista de Emails
var solicitacao = getIdInstanceProcesso();
var codUsu = getUsuarioInclusao();
var tabChamado = getLinhasFormulario("AD_CHAMADOTI");
var tabAgentesChamado = getLinhasFormulario("AD_AGENTESCHAMADO");
var linhaExistente = false;
var c = null;

for (var i = 0; i < tabChamado.length; i++) {
    if (tabChamado[i].getCampo("IDINSTPRN") == solicitacao) {
        linhaExistente = true;
        c = i;
        break;
    }
}

if (linhaExistente) {
    var linhaChamado = tabChamado[c];
    var statusCiclo1 = linhaChamado.getCampo("CICLO1");

    if (statusCiclo1 == 'NA') {
        throw new Error("O chamado está <b>aguardando definição</b>!");
    }

    if ((statusCiclo1 == 'N' || statusCiclo1 == 'A') && (!linhaChamado.getCampo("JUSTIFICATIVA") || linhaChamado.getCampo("JUSTIFICATIVA") == null || linhaChamado.getCampo("JUSTIFICATIVA").trim() == '')) {
        throw new Error("É obrigatório informar a <b>justificativa</b> para encaminhar o chamado!");
    }
} else {
    throw new Error("Erro crítico: Registro principal do chamado não encontrado.");
}

var listaCandidatos = [];
var listaDonos = [];
var listaObservadores = [];
var listaEmailsFinal = "";
var emailUsuarioAtual = null;

var listaDominiosPermitidos = ["gmail.com", "hotmail.com", "outlook.com.br", "sankhya.com.br", "unikaservicos.com.br"];

for (var j = 0; j < tabAgentesChamado.length; j++) {
    var tipoAtribuicao = tabAgentesChamado[j].getCampo("TIPOATRIBUICAO");
    var codUsuAgente = tabAgentesChamado[j].getCampo("CODUSU");

    if (tipoAtribuicao == 'C') {
        listaCandidatos.push(codUsuAgente);
    }

    if (tipoAtribuicao == 'D') {
        listaDonos.push(codUsuAgente);
    }

    if (tipoAtribuicao == 'O') {
        listaObservadores.push(codUsuAgente);

        emailUsuarioAtual = buscarDado("EMAIL", "TSIUSU", "CODUSU = :CODUSU", [codUsuAgente]);

        if (!emailUsuarioAtual || emailUsuarioAtual.trim() === '') {
            throw new Error("O observador <b>[" + codUsuAgente + "]</b> não possui e-mail cadastrado!");
        } else {
            var emails = emailUsuarioAtual.split(",");
            for (var k = 0; k < emails.length; k++) {
                var email = (emails[k] || '').trim();
                if (email === '') continue;

                var parts = email.split('@');
                var dominio = parts.length > 1 ? parts[1].toLowerCase().trim() : null;

                if (dominio && listaDominiosPermitidos.indexOf(dominio) != -1) {
                    throw new Error("O e-mail <b>[" + email + "]</b> do agente <b>[" + codUsuAgente + "]</b> não tem domínio permitido!");
                }

                // adiciona cada email individualmente (evita duplicar toda a string)
                listaEmailsFinal += email + ", ";
            }
        }
    }
}

if (listaObservadores.length > 3) {
    throw new Error("O número máximo de <b>observadores</b> permitido é 3 (três)!");
}

if (listaCandidatos.length > 0 && listaDonos.length >= 1) {
    throw new Error("Quando houver <b>candidato(s)</b>, não pode haver <b>dono(s)</b>!");
} else if (listaCandidatos.length == 0 && listaDonos.length == 0) {
    throw new Error("Obrigatório vincular pelo menos um <b>candidato</b> ou <b>dono</b>!");
}

setCampo("LISTAEMAIL", listaEmailsFinal);

try {
    salvarCamposAlterados();

} catch (e) {
    console.error("Erro no Evento de Ação da Triagem: ", e);
    throw new Error("<b>Falha na Validação/Ação da Triagem:</b> <br>" + e.message);
}