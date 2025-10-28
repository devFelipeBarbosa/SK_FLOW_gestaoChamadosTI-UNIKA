// Evento Finalizar: Aprovacao Chamado
var codUsu = getUsuarioInclusao();
var sid = getIdInstanceProcesso(), tC = getLinhasFormulario("AD_CHAMADOTI"), c = null, has = false, i;

for (i = 0; i < tC.length; i++) {
    if (tC[i].getCampo("IDINSTPRN") == sid) {
        has = true;
        c = tC[i];
        break;
    }
}

if (has) {
    var ci3 = c.getCampo("CICLO3");
    var jcaRaw = c.getCampo("JUSTIFICATIVASOLUCAO");

    // normaliza o texto: converte para string, remove espaços duplicados e espaços no início/fim
    var jca = (jcaRaw == null ? "" : String(jcaRaw));
    jca = jca.replace(/\s+/g, ' ').trim();

    // validação: se é a aprovacao foi negativa, justificativa obrigatória e com >= 20 chars
    if (ci3 == 'N') {
        if (jca.length == 0) {
            throw new Error("É necessário uma <b>justificativa</b> de reprovação!");
        }
        if (jca.length < 20) {
            throw new Error("A <b>justificativa</b> deve conter pelo menos <b>20</b> caracteres!");
        }
    }

    var ava = c.getCampo("AVALIACAO");

    if (ci3 == 'NA') {
        throw new Error("O chamado está sem definição de aprovação!")
    } else if (ci3 == 'S' && ava == 0) {
        throw new Error("O Chamado precisa ser avaliado para melhorarmos nossa atendimento!")
    } else if (ci3 == 'S' && ava != 0) {

        var nomeCompleto = buscarDado("NOMEUSUCPLT", "TSIUSU", "CODUSU = :CODUSU", [codUsu]);
        var loginUsu = buscarDado("NOMEUSU", "TSIUSU", "CODUSU = :CODUSU", [codUsu]) || null;
        var nome = nomeCompleto ? nomeCompleto.split(" ")[0] : loginUsu;

        var tipo = c.getCampo("TIPO");
        if (tipo == 'I') {
            tipo = 'I-Incidente';
        } else if (tipo == 'R') {
            tipo = 'R-Requisição';
        }
        var codLocal = c.getCampo("CODLOCAL");
        var nomeLocal = buscarDado("DESCRLOCAL", "TGFLOC", "CODLOCAL = :CODLOCAL", [codLocal]) || 'Não informado';
        var categoria = c.getCampo("ID_CATEGORIATI");
        var nomeCategoria = buscarDado("DESCRICAO", "AD_CATEGORIATI", "ID_CATEGORIATI = :ID_CATEGORIATI", [categoria]) || 'Não informada';
        var titulo = c.getCampo("TITULO") || '';
        var descricao = c.getCampo("TEXTOCHAMADO") || '';
        var dataPrevista = c.getCampo("PREVATENDIMENTO");
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

        textoEmail += "<br><b>Solitação: </b>" + sid + ";<br>"
            + "<b>Usuário: </b>" + codUsu + " - " + nome + ";<br>"
            + "<b>Tipo: </b>" + tipo + ";<br>"
            + "<b>Localização: </b>" + codLocal + " - " + nomeLocal + ";<br>"
            + "<b>Categoria: </b>" + categoria + " - " + nomeCategoria + "<br>";

        setCampo("CORPOEMAIL", textoEmail);

        c.setCampo("STATUSCHAMADO", 'K'); 

        try {
            salvarCamposAlterados();

        } catch (e) {
            console.error("Erro no Evento de Ação da Triagem: ", e);
            throw new Error("<b>Falha na Validação/Ação da Triagem:</b> <br>" + e.message);
        }

    }

}