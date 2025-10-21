// Candidato Dinâmico - Em Atendimento (Formato Padrão)
var solicitacao = getIdInstanceProcesso();
var tabAgentesChamado = getLinhasFormulario("AD_AGENTESCHAMADO");

var listaCandidatos = [];
var listaDonos = [];      
var k = 0;
while (k < tabAgentesChamado.length) {

    if (tabAgentesChamado[k].getCampo("IDINSTPRN") == solicitacao) {

        var tipoAtribuicao = tabAgentesChamado[k].getCampo("TIPOATRIBUICAO");
        var codUsuAgente = tabAgentesChamado[k].getCampo("CODUSU");
        
        // Cria o objeto no formato esperado pelo Flow
        var responsavelObj = {
            COLUNA: codUsuAgente,
            TIPO: 'U' 
        };

        if (tipoAtribuicao == 'C') {
            listaCandidatos.push(responsavelObj);
        }

        if (tipoAtribuicao == 'D') {
            listaDonos.push(responsavelObj); 
        }
    }
    k++;
}


if (listaDonos.length > 0) {
    return listaDonos; 
} else {
    return listaCandidatos; 
}
