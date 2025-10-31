CREATE OR REPLACE TRIGGER TRG_AD_HISTSOL_BD
BEFORE DELETE ON AD_HISTORICOSOLUCOES
FOR EACH ROW
DECLARE
    v_bloq CHAR(1);
BEGIN
    -- Busca o flag no mestre pelo vínculo (ajuste o nome da coluna FK se necessário)
    SELECT BLOQ_EXC_HIST
      INTO v_bloq
      FROM AD_CHAMADOTI
     WHERE IDINSTPRN = :OLD.IDINSTPRN;   -- <= se a FK tiver outro nome, ajuste aqui

    IF v_bloq = 'S' THEN
        RAISE_APPLICATION_ERROR(-20000,
          'Não é permitido excluir Histórico de Soluções nesta etapa (Aprovação).');
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        -- Sem pai correspondente: por segurança, bloqueia também
        RAISE_APPLICATION_ERROR(-20001,
          'Exclusão bloqueada: Chamado pai não localizado para o histórico.');
END;
