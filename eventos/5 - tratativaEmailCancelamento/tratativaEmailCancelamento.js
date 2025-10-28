// Ação agendada: Tratativa E-mail Cancelamento
var solicitacao = getIdInstanceProcesso();
var tabChamado = getLinhasFormulario("AD_CHAMADOTI");
var linhaExistente = false;
var c = null;

for (var i = 0; i < tabChamado.length; i++) {
    if (tabChamado[i].getCampo("IDINSTPRN") == solicitacao) {
        linhaExistente = true;
        c = tabChamado[i];
        break;
    }
}

var descricao = c.getCampo("TEXTOCHAMADO") || '',
    sta = c.getCampo("STATUSCHAMADO"),
    ci1 = c.getCampo("CICLO1"),
    ju1 = c.getCampo("JUSTIFICATIVA") || '',
    ci2 = c.getCampo("CICLO2"),
    ju2 = c.getCampo("JUSTIFICATIVACANC") || '';

var textoEmail = descricao;

textoEmail += "<br><br>------------------ Justificativa -------------------<br>";

if (sta == 'A' && ci1 == 'A') {
    textoEmail += "Sua soliciatação foi cancelada devido ao tempo de espera para retorno de ajuste do chamado!<br>";
} else if (sta == 'T' && ci1 == 'N') {
    textoEmail += ju1 + "<br>";
} else if ((sta == 'E' || sta == 'O') && ci1 == 'S' && ci2 == 'S') {
    textoEmail += ju2 + "<br>";
}

setCampo("CORPOEMAIL", textoEmail);
c.setCampo("STATUSCHAMADO", 'C');

try {
    salvarCamposAlterados();

} catch (e) {
    console.error("Erro no Evento de Ação da Triagem: ", e);
    throw new Error("<b>Falha na Validação/Ação da Triagem:</b> <br>" + e.message);
}