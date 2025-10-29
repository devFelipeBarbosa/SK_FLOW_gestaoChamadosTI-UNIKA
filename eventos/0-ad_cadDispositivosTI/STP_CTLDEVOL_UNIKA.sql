CREATE OR REPLACE PROCEDURE STP_CTLDEVOL_UNIKA (
       P_TIPOEVENTO INT,    -- Identifica o tipo de evento
       P_IDSESSAO   VARCHAR2, -- Identificador da execução. Serve para buscar informações dos campos da execução.
       P_CODUSU     INT       -- Código do usuário logado
) AS
       BEFORE_INSERT INT;
       AFTER_INSERT  INT;
       BEFORE_DELETE INT;
       AFTER_DELETE  INT;
       BEFORE_UPDATE INT;
       AFTER_UPDATE  INT;
       BEFORE_COMMIT INT;

       vStatusUso   VARCHAR2(1);
       vDataFin     DATE;
       vResp        NUMBER;      -- 1 = Sim, 0 = Não (padrão para funções de confirmação)
BEGIN
       BEFORE_INSERT := 0;
       AFTER_INSERT  := 1;
       BEFORE_DELETE := 2;
       AFTER_DELETE  := 3;
       BEFORE_UPDATE := 4;
       AFTER_UPDATE  := 5;
       BEFORE_COMMIT := 10;

       -------------------------------------------------------------------------------
       -- Regra: Se STATUSUSO = 'D' e DATAFIN nula, perguntar se usa a data do servidor.
       --         Se SIM -> DATAFIN := TRUNC(SYSDATE)
       --         Se NÃO -> bloquear o salvamento.
       -------------------------------------------------------------------------------

       IF P_TIPOEVENTO IN (BEFORE_INSERT, BEFORE_UPDATE) THEN

          vStatusUso := NVL(EVP_GET_CAMPO_TEXTO(P_IDSESSAO, 'STATUSUSO'), ' ');
          vDataFin   := EVP_GET_CAMPO_DTA(P_IDSESSAO, 'DATAFIN');

          IF vStatusUso = 'D' AND vDataFin IS NULL THEN

             -- Opção 1 (mais comum em versões recentes): EVP_CONFIRMA retorna 1/0
             vResp := NVL(EVP_CONFIRMA(
                           P_IDSESSAO,
                           'Você marcou o status "D" (Devolvido) sem informar a DATAFIN.'||
                           CHR(10)||
                           'Deseja usar a data do servidor (somente data, sem hora)?'
                         ), 0);

             -- Opção 2 (caso sua instância use EVP_PERGUNTA):
             -- vResp := NVL(EVP_PERGUNTA(
             --               P_IDSESSAO,
             --               'Você marcou o status "D" (Devolvido) sem informar a DATAFIN.'||
             --               CHR(10)||
             --               'Deseja usar a data do servidor (somente data, sem hora)?'
             --             ), 0);

             IF vResp = 1 THEN
                -- Usuário confirmou -> seta DATAFIN como data do servidor (sem hora)
                EVP_SET_CAMPO_DTA(P_IDSESSAO, 'DATAFIN', TRUNC(SYSDATE));
             ELSE
                -- Usuário NÃO confirmou -> bloqueia a operação
                RAISE_APPLICATION_ERROR(
                  -20000,
                  'Para salvar com STATUSUSO = "D" é obrigatório informar a DATAFIN.'||
                  CHR(10)||'Preencha a DATAFIN ou confirme o uso da data do servidor.'
                );
             END IF;
          END IF;
       END IF;
END;
/
