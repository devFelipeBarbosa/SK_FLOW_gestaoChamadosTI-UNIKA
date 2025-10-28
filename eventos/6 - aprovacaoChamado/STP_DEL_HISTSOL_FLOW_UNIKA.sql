CREATE OR REPLACE PROCEDURE SANKHYA."STP_DEL_HISTSOL_FLOW_UNIKA" (
    P_IDSESSAO       IN  VARCHAR2,  -- Identificador da sessão
    P_CODUSU         IN  INT,       -- Código do usuário logado
    P_MENSAGEM_ERRO  OUT VARCHAR2   -- Se preenchido, o Flow considera erro e cancela a ação
) AS
    P_INSTANCIA_PROCESSO NUMBER(10);  -- Instância do Processo
    P_INSTANCIA_TAREFA   NUMBER(10);  -- Instância da Tarefa
    P_ONDE               VARCHAR2(100);
    P_QUANDO             VARCHAR2(100);
    P_ACAO               VARCHAR2(100);
    P_TABELA             VARCHAR2(200); -- ENTIDADE/TABELA origem da operação
BEGIN
    /***************************************************************************
      Observação: ONDE/QUANDO/ACAO são códigos de CARACTERE.
      Portanto, use ACT_CHAR_FIELD (não ACT_INT_FIELD) para lê-los.
    ***************************************************************************/

    -- Contexto
    P_INSTANCIA_PROCESSO := SANKHYA.ACT_INT_FIELD (P_IDSESSAO, 0, 'ID_INSTANCIA_PROCESSO');
    P_INSTANCIA_TAREFA   := SANKHYA.ACT_INT_FIELD (P_IDSESSAO, 0, 'ID_INSTANCIA_ID_INSTANCIA_TAREFA');

    P_ONDE   := SANKHYA.ACT_CHAR_FIELD(P_IDSESSAO, 0, 'ONDE');   -- 'F' = Formulário Formatado / 'E' = Embarcado
    P_QUANDO := SANKHYA.ACT_CHAR_FIELD(P_IDSESSAO, 0, 'QUANDO'); -- 'A' = Antes / 'D' = Depois
    P_ACAO   := SANKHYA.ACT_CHAR_FIELD(P_IDSESSAO, 0, 'ACAO');   -- 'E' = Excluir

    -- Alguns ambientes expõem ENTIDADE, outros TABELA
    P_TABELA := NVL(
                   SANKHYA.ACT_CHAR_FIELD(P_IDSESSAO, 0, 'ENTIDADE'),
                   SANKHYA.ACT_CHAR_FIELD(P_IDSESSAO, 0, 'TABELA')
                );

    -- Regra: bloquear somente EXCLUSÃO do detalhe AD_HISTORICOSOLUCOES (Antes, Formulário)
    IF (P_ACAO = 'E')
       AND (P_QUANDO = 'A')
       AND (P_ONDE IN ('F','E'))
       AND (UPPER(P_TABELA) = 'AD_HISTORICOSOLUCOES')
    THEN
        P_MENSAGEM_ERRO := 'Não é permitido excluir registros de "Histórico de Soluções" nesta etapa.';
        RETURN; -- cancela a ação
    END IF;

    -- Libera nos demais casos
    P_MENSAGEM_ERRO := NULL;

EXCEPTION
    WHEN OTHERS THEN
        P_MENSAGEM_ERRO := SUBSTR(SQLERRM, 1, 4000);
END;
/
