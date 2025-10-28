// Aguardando Terceiro Compra, Alteração da Tabela (Salvar)
var sid=getIdInstanceProcesso(),tC=getLinhasFormulario("AD_CHAMADOTI"),c=null,has=false,i,lst=[],fid=null;
for(i=0;i<tC.length;i++){if(tC[i].getCampo("IDINSTPRN")==sid){has=true;c=tC[i];break}}
if(has){
  var tipo=c.getCampo("TIPO"),
      cat=c.getCampo("ID_CATEGORIATI"),
      loc=c.getCampo("CODLOCAL"),
      dsc=c.getCampo("DESCSOLUCAO")||null,
      idc=c.getCampo("ID_PK")||null,
      prd=c.getCampo("CODPROD")||null,
      terc=c.getCampo("TERCEIRO"),
      dtt=c.getCampo("DTTERCEIRO"),
      parc=c.getCampo("CODPARC"),
      dter=c.getCampo("DESCTERCEIRO"),
      sh=c.getCampo("SALVASOLUCAO")||"S";
      bas=c.getCampo("BASECONHECIMENTO")||"S";
}
var th=getLinhasFormulario("AD_HISTORICOSOLUCOES"),s=null,ant=null;
if(th.length) s=th[th.length-1],ant=s.getCampo("DESCSOLUCAO");
function setCampos(r){r.setCampo("CODREGISTRO",1);r.setCampo("IDTAREFA","UserTask_1dsyzbu");r.setCampo("TIPO",tipo);r.setCampo("ID_CATEGORIATI",cat);r.setCampo("CODLOCAL",loc);r.setCampo("DESCSOLUCAO",dsc);r.setCampo("ID_PK",idc);r.setCampo("CODPROD",prd);r.setCampo("TERCEIRO",terc);r.setCampo("DTTERCEIRO",dtt);r.setCampo("CODPARC",parc);r.setCampo("DESCTERCEIRO",dter);r.setCampo("BASECONHECIMENTO",bas)}
if(sh=="S"&&dsc!=ant){
  var ns=novaLinhaFormulario("AD_HISTORICOSOLUCOES");setCampos(ns);
  try{ns.save()}catch(e){console.error("Erro ao CRIAR a solução TI: ",e);throw new Error("Erro ao <b>CRIAR a solução TI</b>! <br>"+e.message)}
}else if(sh=="S"&&th.length&&dsc==ant){
  setCampos(s);
  try{salvarCamposAlterados()}catch(e){console.error("Erro ao ALTERAR a solução TI: ",e);throw new Error("Erro ao <b>ALTERAR a solução TI</b>! <br>"+e.message)}
}
if(prd!=null&&prd!==""&&prd!==undefined&&idc==null){
  lst=verificaDispositivo(prd,sid)||[];
  if(lst.length){fid=lst[0].ID_PK}
}
if(lst.length==1&&idc==null){
  c.setCampo("ID_PK",fid);
  try{salvarCamposAlterados()}catch(e){console.error("Erro ao ALTERAR a solução TI: ",e);throw new Error("Erro ao <b>ALTERAR a solução TI</b>! <br>"+e.message)}
}else if(lst.length>1&&idc==null){
  var msg="";for(i=0;i<lst.length;i++){msg+=("ID: "+lst[i].ID_PK+" - CODPROD: "+lst[i].CODPROD+(i<lst.length-1?"<br>":""))}
  throw new Error("Produto vinculado ao chamado TI tem mais de uma referência de cadastro, para prosseguir informe ao menos um deles:<br>"+msg)
}
function verificaDispositivo(prod,idp){
  var L=[],id=null,q=getQuery();
  q.setParam("CODPROD",prod);q.setParam("IDINSTPRN",idp);
  q.nativeSelect("SELECT DIS.ID_PK, CAD.CODPROD FROM AD_CHAMADOTI CHA "+
  "INNER JOIN AD_EQUIPDISPCHAMADO DIS ON (DIS.IDINSTPRN = CHA.IDINSTPRN) "+
  "INNER JOIN AD_CADDISPOSITIVOSTI CAD ON (DIS.ID_PK = CAD.ID_PK AND CAD.CODPROD = CHA.CODPROD) "+
  "WHERE CHA.CODPROD = {CODPROD} AND CHA.IDINSTPRN = {IDINSTPRN}");
  try{while(q.next()){id=parseInt(q.getString("ID_PK"))||null;if(id>=0)L.push({ID_PK:id,CODPROD:prod})}}
  catch(e){console.error("Erro ao executar a função verificaDispositivo: ",e);throw new Error("Erro ao <b>executar a função verificaDispositivo</b>! <br>"+e.message)}
  q.close();return L.length?L:null
}
