// Ação agendada: Tratativa E-mail Triagem
var solicitacao = getIdInstanceProcesso();
var codUsu = getUsuarioInclusao();
var tabChamado = getLinhasFormulario("AD_CHAMADOTI");
var linhaExistente = false;
var c = null;

for (var i = 0; i < tabChamado.length; i++) {
    if (tabChamado[i].getCampo("IDINSTPRN") == solicitacao) {
        linhaExistente = true;
        c = i;
        break;
    }
}

var nomeCompleto = buscarDado("NOMEUSUCPLT", "TSIUSU", "CODUSU = :CODUSU", [codUsu]);
var loginUsu = buscarDado("NOMEUSU", "TSIUSU", "CODUSU = :CODUSU", [codUsu]) || null;
var nome = nomeCompleto ? nomeCompleto.split(" ")[0] : loginUsu;

var tipo = tabChamado[c].getCampo("TIPO");
if (tipo == 'I') {
    tipo = 'I-Incidente';
} else if (tipo == 'R') {
    tipo = 'R-Requisição';
}
var codLocal = tabChamado[c].getCampo("CODLOCAL");
var nomeLocal = buscarDado("DESCRLOCAL", "TGFLOC", "CODLOCAL = :CODLOCAL", [codLocal]) || 'Não informado';
var categoria = tabChamado[c].getCampo("ID_CATEGORIATI");
var nomeCategoria = buscarDado("DESCRICAO", "AD_CATEGORIATI", "ID_CATEGORIATI = :ID_CATEGORIATI", [categoria]) || 'Não informada';
var titulo = tabChamado[c].getCampo("TITULO") || '';
var descricao = tabChamado[c].getCampo("TEXTOCHAMADO") || '';
var dataPrevista = tabChamado[c].getCampo("PREVATENDIMENTO");
var dataFormatada;

if (dataPrevista) {
    dataPrevista = new Date(dataPrevista);
    var dia = dataPrevista.getDate();
    var mes = dataPrevista.getMonth() + 1;
    var ano = dataPrevista.getFullYear();
    dataFormatada = dia + "/" + mes + "/" + ano;
} else {
    dataFormatada = 'Não informada';
}


var textoEmail = "<b>Titulo: </b>" + titulo + ";<br>" + "<b>Descrição: </b>" + descricao;

textoEmail += "<br><br>-------------- Dados do Chamado ---------------<br>"
    + "<b>Solitação: </b>" + solicitacao + ";<br>"
    + "<b>Usuário: </b>" + codUsu + " - " + nome + ";<br>"
    + "<b>Tipo: </b>" + tipo + ";<br>"
    + "<b>Localização: </b>" + codLocal + " - " + nomeLocal + ";<br>"
    + "<b>Categoria: </b>" + categoria + " - " + nomeCategoria + ";<br>"
    + "<b>Data Prevista de Entrega: </b>" + dataFormatada + " (OBS.: a previsão de entrega pode sofrer alterações ao longo do atendimento).<br>";

setCampo("CORPOEMAIL", textoEmail);

try {
    salvarCamposAlterados();

} catch (e) {
    console.error("Erro no Evento de Ação da Triagem: ", e);
    throw new Error("<b>Falha na Validação/Ação da Triagem:</b> <br>" + e.message);
}