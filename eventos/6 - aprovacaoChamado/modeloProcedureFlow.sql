CREATE OR REPLACE PROCEDURE SANKHYA."ADP_BLOQ_EXC_HISTSOL" (
	   P_IDSESSAO IN VARCHAR2,       --Identificador da sessao
       P_CODUSU INT,                 -- Codigo do usuario logado
	   P_MENSAGEM_ERRO OUT VARCHAR2  -- Caso seja preenchida alguma informacao aqui, a execucao da procedure ira ser considerada com status de erro e esta mensagem inserida no log de erro 
) AS
       P_INSTANCIA_PROCESSO NUMBER(10);  -- Codigo da instancia do Processo que originou a chamada.
       P_INSTANCIA_TAREFA NUMBER(10);  -- Codigo da instancia da tarefa que originou a chamada.
       P_ONDE VARCHAR2(100);
	   P_QUANDO VARCHAR2(100);
       P_ACAO  VARCHAR2(100);
BEGIN
	/*******************************************************************************
	 E possivel obter o valor dos campos atraves das Functions:
	  
	 Valores recebidos de cada parametros são:
	  
	 P_ONDE: 'A' APONTAMENTO
	  		 'E' FORMULARIO EMBARCADO
	  		 'F' FORMULARIO FORMATADO
	  		 'P' PROCESSO
	  		 'T' TAREFA	
	  				 
	 P_QUANDO:'A' ANTES
			  'D' DEPOIS
				
	 P_ACAO: 'I' INSERIR
			 'A' ATUALIZAR
			 'E' EXCLUIR
			 'V' SALVAR
			 'S' INICIAR
			 'D' ATRIBUIÇÃO / DESATRIBUIÇÃO
			 'H' CONCLUIR
			 'C' CRIAÇÃO
			 'F' FINALIZAÇÃO
			 'P' PAUSAR
	   
	  EVP_GET_CAMPO_DTA(P_IDSESSAO, 'NOMECAMPO')   -- PARA CAMPOS DE DATA
	  EVP_GET_CAMPO_INT(P_IDSESSAO, 'NOMECAMPO')   -- PARA CAMPOS NUMERICOS INTEIROS
	  EVP_GET_CAMPO_DEC(P_IDSESSAO, 'NOMECAMPO')   -- PARA CAMPOS NUMERICOS DECIMAIS
	  EVP_GET_CAMPO_TEXTO(P_IDSESSAO, 'NOMECAMPO') -- PARA CAMPOS TEXTO
	  
	  O primeiro argumento e uma chave para esta execucao. O segundo es o nome do campo.
	  
	  Para os eventos BEFORE UPDATE, BEFORE INSERT e AFTER DELETE todos os campos estarao disponiveis.
	  Para os demais, somente os campos que pertencem a PK
	  
	  * Os campos CLOB/TEXT serao enviados convertidos para VARCHAR(4000)
	  
	  Tambem e possivel alterar o valor de um campo atraves das Stored procedures:
	  
	  EVP_SET_CAMPO_DTA(P_IDSESSAO,  'NOMECAMPO', VALOR) -- VALOR DEVE SER UMA DATA
	  EVP_SET_CAMPO_INT(P_IDSESSAO,  'NOMECAMPO', VALOR) -- VALOR DEVE SER UM NUMERO INTEIRO
	  EVP_SET_CAMPO_DEC(P_IDSESSAO,  'NOMECAMPO', VALOR) -- VALOR DEVE SER UM NUMERO DECIMAL
	  EVP_SET_CAMPO_TEXTO(P_IDSESSAO,  'NOMECAMPO', VALOR) -- VALOR DEVE SER UM TEXTO
	********************************************************************************/
	
	--------------------------------------------------------------------------------------------------------------------------
	--PARA BUSCAR VALORES DE CAMPOS DE FORMULARIOS BASTA CHAMAR UMA DAS FUNCOES PREVIAMENTE CRIADAS ABAIXO:                 --
	--PASSANDO COMO PARAMETRO A VARIAVEL  P_INSTANCIA_PROCESSO E O NOME DO CAMPO A SER BUSCADO                              --
	--FLW_GET_CAMPO_TXT(P_INSTANCIA_PROCESSO, 'NOMECAMPO')                                                                  --
	--FLW_GET_CAMPO_INT(P_INSTANCIA_PROCESSO, 'NOMECAMPO')                                                                  --
	--FLW_GET_CAMPO_DEC(P_INSTANCIA_PROCESSO, 'NOMECAMPO')                                                                  --
	--FLW_GET_CAMPO_DTA(P_INSTANCIA_PROCESSO, 'NOMECAMPO')                                                                  --
	--                                                                                                                      --
	--PARA EDITAR VALORES DE CAMPOS DE FORMULARIOS BASTA CHAMAR UMA DAS PROCEDURES PREVIAMENTE CRIADAS ABAIXO:              --
	--PASSANDO COMO PARAMETRO A VARIAVEL P_INSTANCIA_PROCESSO, O NOME DO CAMPO A SER BUSCADO E O NOVO VALOR                 --
	--FLW_SET_CAMPO_TXT(P_INSTANCIA_PROCESSO, 'NOMECAMPO', P_VALOR VARCHAR(4000) )                                          --
	--FLW_SET_CAMPO_INT(P_INSTANCIA_PROCESSO, 'NOMECAMPO', P_VALOR INT )                                                    --
	--FLW_SET_CAMPO_DEC(P_INSTANCIA_PROCESSO, 'NOMECAMPO', P_VALOR DEC )                                                    --
	--FLW_SET_CAMPO_DTA(P_INSTANCIA_PROCESSO, 'NOMECAMPO', P_VALOR DATETIME )                                               --
	--                                                                                                                      --
	--------------------------------------------------------------------------------------------------------------------------  
    P_INSTANCIA_PROCESSO := SANKHYA.ACT_INT_FIELD(P_IDSESSAO, 0, 'ID_INSTANCIA_PROCESSO');
	P_INSTANCIA_TAREFA := SANKHYA.ACT_INT_FIELD(P_IDSESSAO, 0, 'ID_INSTANCIA_ID_INSTANCIA_TAREFA');
	P_ONDE := SANKHYA.ACT_INT_FIELD(P_IDSESSAO, 0, 'ONDE');
	P_QUANDO := SANKHYA.ACT_INT_FIELD(P_IDSESSAO, 0, 'QUANDO');
	P_ACAO :=  SANKHYA.ACT_INT_FIELD(P_IDSESSAO, 0, 'ACAO');
	
    -- <ESCREVA SEU CODIGO AQUI> --

	
EXCEPTION
	WHEN others THEN
		P_MENSAGEM_ERRO := SUBSTR(SQLERRM, 1, 4000);
    
END;