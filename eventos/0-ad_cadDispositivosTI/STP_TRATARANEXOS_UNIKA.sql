CREATE OR REPLACE PROCEDURE SANKHYA.STP_TRATARANEXOS_UNIKA (
    P_TIPOEVENTO IN INT,       -- 0 BI, 1 AI, 2 BD, 3 AD, 4 BU, 5 AU, 10 BC
    P_IDSESSAO   IN VARCHAR2,  -- Sessão do evento
    P_CODUSU     IN INT        -- Usuário logado
) AS
    BEFORE_INSERT CONSTANT INT := 0;
    AFTER_INSERT  CONSTANT INT := 1;
    BEFORE_DELETE CONSTANT INT := 2;
    AFTER_DELETE  CONSTANT INT := 3;
    BEFORE_UPDATE CONSTANT INT := 4;
    AFTER_UPDATE  CONSTANT INT := 5;
    BEFORE_COMMIT CONSTANT INT := 10;

    v_idinstprn NUMBER;
BEGIN
    ----------------------------------------------------------------------------
    -- Dispara no AFTER_INSERT ou AFTER_UPDATE do formulário formatado
    ----------------------------------------------------------------------------
    IF P_TIPOEVENTO IN (AFTER_INSERT, AFTER_UPDATE, BEFORE_COMMIT) THEN

        -- Captura o ID da instância do processo (campo do formulário)
        v_idinstprn := EVP_GET_CAMPO_INT(P_IDSESSAO, 'IDINSTPRN');

        ----------------------------------------------------------------------------
        -- Atualiza anexos com base nos registros da TWFIVAR (embarcardo)
        ----------------------------------------------------------------------------
        UPDATE AD_CHAMADOTI t
           SET t.ANEXO1 = COALESCE((
                    SELECT TO_BLOB(UTL_RAW.CAST_TO_RAW(v.TEXTOLONGO))
                      FROM TWFIVAR v
                     WHERE v.IDINSTPRN = t.IDINSTPRN
                       AND v.NOME = 'ANEXO1'
                       AND v.TEXTOLONGO IS NOT NULL
                       AND ROWNUM = 1
                ), t.ANEXO1),
               t.ANEXO2 = COALESCE((
                    SELECT TO_BLOB(UTL_RAW.CAST_TO_RAW(v.TEXTOLONGO))
                      FROM TWFIVAR v
                     WHERE v.IDINSTPRN = t.IDINSTPRN
                       AND v.NOME = 'ANEXO2'
                       AND v.TEXTOLONGO IS NOT NULL
                       AND ROWNUM = 1
                ), t.ANEXO2),
               t.ANEXO3 = COALESCE((
                    SELECT TO_BLOB(UTL_RAW.CAST_TO_RAW(v.TEXTOLONGO))
                      FROM TWFIVAR v
                     WHERE v.IDINSTPRN = t.IDINSTPRN
                       AND v.NOME = 'ANEXO3'
                       AND v.TEXTOLONGO IS NOT NULL
                       AND ROWNUM = 1
                ), t.ANEXO3)
         WHERE t.IDINSTPRN = v_idinstprn;

    END IF;

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('STP_TRATARANEXOS_UNIKA ERRO: ' || SQLERRM);
END;
