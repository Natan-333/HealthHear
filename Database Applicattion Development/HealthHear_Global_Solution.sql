SET SERVEROUTPUT ON;

-- DROP TABLES CASO NECESSÁRIO
DROP TABLE usuario CASCADE CONSTRAINTS;
DROP TABLE registro CASCADE CONSTRAINTS;
DROP TABLE feedback CASCADE CONSTRAINTS;
DROP TABLE especialidade CASCADE CONSTRAINTS;
DROP TABLE registro_especialidade CASCADE CONSTRAINTS;
DROP TABLE resposta CASCADE CONSTRAINTS;

-- SELECTS CASO NECESSÁRIO
SELECT * FROM usuario;
SELECT * FROM registro;
SELECT * FROM feedback;
SELECT * FROM especialidade;
SELECT * FROM registro_especialidade;
SELECT * FROM resposta;

-- 01. CRIAÇÃO DAS TABELAS:
CREATE TABLE Usuario (
    id_usuario NUMBER(9) CONSTRAINT pk_id_usuario PRIMARY KEY,
    email_usuario VARCHAR(255) CONSTRAINT uk_email_usuario UNIQUE CONSTRAINT nn_email_usuario NOT NULL,
    senha_usuario VARCHAR(255) CONSTRAINT nn_senha_usuario NOT NULL,
    nome_usuario VARCHAR(255) CONSTRAINT nn_nome_usuario NOT NULL,
    cpf_usuario CHAR(11) CONSTRAINT uk_cpf_usuario UNIQUE CONSTRAINT nn_cpf_usuario NOT NULL,
    imagem_usuario VARCHAR(255)
);

CREATE TABLE Registro (
    id_registro NUMBER(9) CONSTRAINT pk_id_registro PRIMARY KEY,
    numero_registro VARCHAR(255) CONSTRAINT nn_numero_registro NOT NULL,
    uf_registro CHAR(2) CONSTRAINT nn_uf_registro NOT NULL,
    tipo_registro VARCHAR(255) CONSTRAINT nn_tipo_registro NOT NULL,
    id_usuario NUMBER(9) CONSTRAINT fk_usuario_registro REFERENCES Usuario(id_usuario),
    CONSTRAINT uk_registro_unico UNIQUE (numero_registro, uf_registro, tipo_registro)
);

CREATE TABLE Feedback (
    id_feedback NUMBER(9) CONSTRAINT pk_id_feedback PRIMARY KEY,
    data_feedback DATE CONSTRAINT nn_data_feedback NOT NULL,
    titulo_feedback VARCHAR(255) CONSTRAINT nn_titulo_feedback NOT NULL,
    descricao_feedback VARCHAR(255) CONSTRAINT nn_descricao_feedback NOT NULL,
    nota_feedback NUMBER(4,2) CONSTRAINT nn_nota_feedback NOT NULL,
    id_paciente NUMBER(9) CONSTRAINT fk_paciente_feedback REFERENCES Usuario(id_usuario),
    id_registro NUMBER(9) CONSTRAINT fk_registro_feedback REFERENCES Registro(id_registro),
    is_anonimo NUMBER(1) CONSTRAINT nn_is_anonimo_feedback NOT NULL,
    acao_tomada_feedback VARCHAR(255),
    evidencia_feedback VARCHAR(255),
    tipo_feedback VARCHAR(255) CONSTRAINT nn_tipo_feedback NOT NULL
);

CREATE TABLE Especialidade (
    id_especialidade NUMBER(9) CONSTRAINT pk_id_especialidade PRIMARY KEY,
    nome_especialidade VARCHAR(255) CONSTRAINT uk_nome_especialidade UNIQUE CONSTRAINT nn_nome_especilidade NOT NULL
);

CREATE TABLE Registro_Especialidade (
    id_registro NUMBER(9) CONSTRAINT fk_registro_especialidade REFERENCES Registro(id_registro),
    id_especialidade NUMBER(9) CONSTRAINT fk_especialidade_registro REFERENCES Especialidade(id_especialidade)
);

CREATE TABLE Resposta (
    id_resposta NUMBER(9) CONSTRAINT pk_id_resposta PRIMARY KEY,
    data_resposta DATE CONSTRAINT nn_data_resposta NOT NULL,
    descricao_resposta VARCHAR(255) CONSTRAINT nn_descricao_resposta NOT NULL,
    id_usuario NUMBER(9) CONSTRAINT fk_resposta_usuario REFERENCES Usuario(id_usuario),
    id_feedback NUMBER(9) CONSTRAINT fk_resposta_feedback REFERENCES Feedback(id_feedback)
);

-- 02. Carga de Dados 
-- 02.01. Usuario
CREATE SEQUENCE seq_usuario START WITH 1 INCREMENT BY 1;

DECLARE
    v_email_usuario Usuario.email_usuario%TYPE;
    v_senha_usuario Usuario.senha_usuario%TYPE;
    v_nome_usuario Usuario.nome_usuario%TYPE;
    v_cpf_usuario Usuario.cpf_usuario%TYPE;
    v_imagem_usuario Usuario.imagem_usuario%TYPE;
    v_id_usuario Usuario.id_usuario%TYPE;
    v_contagem_email NUMBER;
    v_contagem_cpf NUMBER;

BEGIN
    SELECT seq_usuario.NEXTVAL INTO v_id_usuario FROM DUAL;

    v_email_usuario := '&email_usuario';
    v_senha_usuario := '&senha_usuario';
    v_nome_usuario := '&nome_usuario';
    v_cpf_usuario := '&cpf_usuario';
    v_imagem_usuario := '&imagem_usuario';

    SELECT COUNT(*) INTO v_contagem_email FROM Usuario WHERE email_usuario = v_email_usuario;
    IF v_contagem_email > 0 THEN
        RAISE_APPLICATION_ERROR(-20008, 'Este email já está cadastrado para um usuário.');
    END IF;

    SELECT COUNT(*) INTO v_contagem_cpf FROM Usuario WHERE cpf_usuario = v_cpf_usuario;
    IF v_contagem_cpf > 0 THEN
        RAISE_APPLICATION_ERROR(-20009, 'Este CPF já está cadastrado para um usuário.');
    END IF;

    INSERT INTO Usuario (id_usuario, email_usuario, senha_usuario, nome_usuario, cpf_usuario, imagem_usuario)
    VALUES (v_id_usuario, v_email_usuario, v_senha_usuario, v_nome_usuario, v_cpf_usuario, v_imagem_usuario);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Usuário inserido com sucesso. ID do Usuário: ' || v_id_usuario);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

-- 02.02 Registro
CREATE SEQUENCE seq_registro START WITH 1 INCREMENT BY 1;

DECLARE
    v_numero_registro Registro.numero_registro%TYPE;
    v_uf_registro Registro.uf_registro%TYPE;
    v_tipo_registro Registro.tipo_registro%TYPE;
    v_id_usuario Registro.id_usuario%TYPE;
    v_id_registro Registro.id_registro%TYPE;

BEGIN
    SELECT seq_registro.NEXTVAL INTO v_id_registro FROM DUAL;

    v_numero_registro := '&numero_registro';
    v_uf_registro := '&uf_registro';
    v_tipo_registro := '&tipo_registro';
    v_id_usuario := &id_usuario;

    INSERT INTO Registro (id_registro, numero_registro, uf_registro, tipo_registro, id_usuario)
    VALUES (v_id_registro, v_numero_registro, v_uf_registro, v_tipo_registro, v_id_usuario);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Dados inseridos com sucesso. ID do Registro: ' || v_id_registro);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

-- 02.03. Feedback
CREATE SEQUENCE seq_feedback START WITH 1 INCREMENT BY 1;

DECLARE
    v_data_feedback Feedback.data_feedback%TYPE;
    v_titulo_feedback Feedback.titulo_feedback%TYPE;
    v_descricao_feedback Feedback.descricao_feedback%TYPE;
    v_nota_feedback Feedback.nota_feedback%TYPE;
    v_id_paciente Feedback.id_paciente%TYPE;
    v_id_registro Feedback.id_registro%TYPE;
    v_is_anonimo Feedback.is_anonimo%TYPE;
    v_acao_tomada_feedback Feedback.acao_tomada_feedback%TYPE;
    v_evidencia_feedback Feedback.evidencia_feedback%TYPE;
    v_tipo_feedback Feedback.tipo_feedback%TYPE;
    v_id_feedback Feedback.id_feedback%TYPE;

BEGIN
    SELECT seq_feedback.NEXTVAL INTO v_id_feedback FROM DUAL;

    v_data_feedback := TO_DATE('&data_feedback', 'DD/MM/YYYY');
    v_titulo_feedback := '&titulo_feedback';
    v_descricao_feedback := '&descricao_feedback';
    v_nota_feedback := &nota_feedback;
    v_id_paciente := &id_paciente;
    v_id_registro := &id_registro;
    v_is_anonimo := &is_anonimo;
    v_acao_tomada_feedback := '&acao_tomada_feedback';
    v_evidencia_feedback := '&evidencia_feedback';
    v_tipo_feedback := '&tipo_feedback';

    INSERT INTO Feedback (id_feedback, data_feedback, titulo_feedback, descricao_feedback, nota_feedback, id_paciente, id_registro, is_anonimo, acao_tomada_feedback, evidencia_feedback, tipo_feedback)
    VALUES (v_id_feedback, v_data_feedback, v_titulo_feedback, v_descricao_feedback, v_nota_feedback, v_id_paciente, v_id_registro, v_is_anonimo, v_acao_tomada_feedback, v_evidencia_feedback, v_tipo_feedback);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Feedback inserido com sucesso. ID do Feedback: ' || v_id_feedback);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

-- 02.04. Especialidade
CREATE SEQUENCE seq_especialidade START WITH 1 INCREMENT BY 1;

DECLARE
    v_nome_especialidade Especialidade.nome_especialidade%TYPE;
    v_id_especialidade Especialidade.id_especialidade%TYPE;
    v_contagem NUMBER;

BEGIN
    SELECT seq_especialidade.NEXTVAL INTO v_id_especialidade FROM DUAL;

    v_nome_especialidade := '&nome_especialidade';

    SELECT COUNT(*) INTO v_contagem FROM Especialidade WHERE UPPER(nome_especialidade) = UPPER(v_nome_especialidade);
    IF v_contagem > 0 THEN
        RAISE_APPLICATION_ERROR(-20006, 'Este nome de Especialidade já existe.');
    END IF;

    INSERT INTO Especialidade (id_especialidade, nome_especialidade)
    VALUES (v_id_especialidade, v_nome_especialidade);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Dados inseridos com sucesso. ID da Especialidade: ' || v_id_especialidade);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

-- 02.05. Registro_Especialidade
CREATE SEQUENCE seq_registro_especialidade START WITH 1 INCREMENT BY 1;

DECLARE
    v_id_registro Registro_Especialidade.id_registro%TYPE;
    v_id_especialidade Registro_Especialidade.id_especialidade%TYPE;
    v_contagem NUMBER;

BEGIN
    v_id_registro := &id_registro;
    v_id_especialidade := &id_especialidade;

    SELECT COUNT(*) INTO v_contagem FROM Registro_Especialidade 
    WHERE id_registro = v_id_registro AND id_especialidade = v_id_especialidade;

    IF v_contagem > 0 THEN
        RAISE_APPLICATION_ERROR(-20007, 'Esta combinação de Registro e Especialidade já existe.');
    END IF;

    INSERT INTO Registro_Especialidade (id_registro, id_especialidade)
    VALUES (v_id_registro, v_id_especialidade);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Associação inserida com sucesso.');

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

-- 02.06. Resposta
CREATE SEQUENCE seq_resposta START WITH 1 INCREMENT BY 1;

DECLARE
    v_data_resposta Resposta.data_resposta%TYPE;
    v_descricao_resposta Resposta.descricao_resposta%TYPE;
    v_id_usuario Resposta.id_usuario%TYPE;
    v_id_feedback Resposta.id_feedback%TYPE;
    v_id_resposta Resposta.id_resposta%TYPE;

BEGIN
    SELECT seq_resposta.NEXTVAL INTO v_id_resposta FROM DUAL;

    v_data_resposta := TO_DATE('&data_resposta', 'DD/MM/YYYY');
    v_descricao_resposta := '&descricao_resposta';
    v_id_usuario := &id_usuario;
    v_id_feedback := &id_feedback;

    INSERT INTO Resposta (id_resposta, data_resposta, descricao_resposta, id_usuario, id_feedback)
    VALUES (v_id_resposta, v_data_resposta, v_descricao_resposta, v_id_usuario, v_id_feedback);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Resposta inserida com sucesso. ID da Resposta: ' || v_id_resposta);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

-- 03. Relatórios

-- 03.01. Relatório de Feedbacks e suas Respostas Correspondentes
DECLARE
    CURSOR c_feedbacks IS
        SELECT f.id_feedback, f.titulo_feedback, f.descricao_feedback, u.nome_usuario AS nome_paciente
        FROM Feedback f
        JOIN Usuario u ON f.id_paciente = u.id_usuario;

    v_feedback c_feedbacks%ROWTYPE;

BEGIN
    OPEN c_feedbacks;

    LOOP
        FETCH c_feedbacks INTO v_feedback;
        EXIT WHEN c_feedbacks%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('Feedback ID: ' || v_feedback.id_feedback || ' - Título: ' || v_feedback.titulo_feedback || ' - Paciente: ' || v_feedback.nome_paciente);

        DECLARE
            CURSOR c_respostas IS
                SELECT r.descricao_resposta, u.nome_usuario AS nome_respondente
                FROM Resposta r
                JOIN Usuario u ON r.id_usuario = u.id_usuario
                WHERE r.id_feedback = v_feedback.id_feedback;

            v_resposta c_respostas%ROWTYPE;
        BEGIN
            OPEN c_respostas;

            LOOP
                FETCH c_respostas INTO v_resposta;
                EXIT WHEN c_respostas%NOTFOUND;

                DBMS_OUTPUT.PUT_LINE('    Resposta: ' || v_resposta.descricao_resposta || ' - Respondente: ' || v_resposta.nome_respondente);
            END LOOP;

            CLOSE c_respostas;
        END;
    END LOOP;

    CLOSE c_feedbacks;
END;

-- 03.02. Relatório de Registros e Especialidades Associadas
DECLARE
    CURSOR c_registros IS
        SELECT r.id_registro, r.numero_registro, r.tipo_registro, u.nome_usuario AS nome_usuario
        FROM Registro r
        JOIN Usuario u ON r.id_usuario = u.id_usuario;

    v_registro c_registros%ROWTYPE;

BEGIN
    OPEN c_registros;

    LOOP
        FETCH c_registros INTO v_registro;
        EXIT WHEN c_registros%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('Registro ID: ' || v_registro.id_registro || ' - Número: ' || v_registro.numero_registro || ' - Tipo: ' || v_registro.tipo_registro || ' - Usuário: ' || v_registro.nome_usuario);

        DECLARE
            CURSOR c_especialidades IS
                SELECT e.nome_especialidade
                FROM Registro_Especialidade re
                JOIN Especialidade e ON re.id_especialidade = e.id_especialidade
                WHERE re.id_registro = v_registro.id_registro;

            v_especialidade c_especialidades%ROWTYPE;
        BEGIN
            OPEN c_especialidades;

            LOOP
                FETCH c_especialidades INTO v_especialidade;
                EXIT WHEN c_especialidades%NOTFOUND;

                DBMS_OUTPUT.PUT_LINE('    Especialidade: ' || v_especialidade.nome_especialidade);
            END LOOP;

            CLOSE c_especialidades;
        END;
    END LOOP;

    CLOSE c_registros;
END;
