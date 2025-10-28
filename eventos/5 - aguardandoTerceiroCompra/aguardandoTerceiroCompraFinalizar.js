// Evento Finalizar: Aguardando Terceiro Compra
var sid = getIdInstanceProcesso(), tC = getLinhasFormulario("AD_CHAMADOTI"), c = null, has = false, i;

for (i = 0; i < tC.length; i++) {
    if (tC[i].getCampo("IDINSTPRN") == sid) {
        has = true;
        c = tC[i];
        break;
    }
}

if (has) {
    var ci2 = c.getCampo("CICLO2") || null;
    var jcaRaw = c.getCampo("JUSTIFICATIVACANC");

    // normaliza o texto: converte para string, remove espaços duplicados e espaços no início/fim
    var jca = (jcaRaw == null ? "" : String(jcaRaw));
    jca = jca.replace(/\s+/g, ' ').trim();

    // validação: se é cancelamento, justificativa obrigatória e com >= 20 chars
    if (ci2 == "S") {
        if (jca.length == 0) {
            throw new Error("É necessário uma <b>justificativa</b> de cancelamento!");
        }
        if (jca.length < 20) {
            throw new Error("A <b>justificativa</b> deve conter pelo menos <b>20</b> caracteres!");
        }
    }

    var dsc = c.getCampo("DESCSOLUCAO") || null;
    var th = getLinhasFormulario("AD_HISTORICOSOLUCOES"), s = null, ant = null;
    if (th.length) {
        s = th[th.length - 1];
        ant = s.getCampo("DESCSOLUCAO") || null;
    }

    if (th.length == 0 && dsc == null && ci2 == 'N') {
        throw new Error("É necessário informar uma <b>solução</b>!");
    } else if (dsc != ant && ci2 == 'N') {
        throw new Error("Há uma incosistência na <b>solução</b>! Mantenha a solução anterior ou informe uma nova.");
    }

    if (ci2 = 'N' && jcaRaw != null) {
        c.setCampo('JUSTIFICATIVACANC', null);
    }

    var sdt = c.getCampo("STATUSTERCEIRO") || null;

    if (sdt != 'F' || sdt != 'NA' || sdt == null) {
        throw new Error("Há uma incosistência no <b>Status</b> do Terceiro! Não é permitido finalizar com status nulo ou considerados em <b>andamento/aguardando</b>!");
    }
}



