SET SERVEROUTPUT ON;


-- 01. CRIAÇÃO DAS TABELAS:

DROP TABLE Denuncia CASCADE CONSTRAINTS;
DROP TABLE Tipo_Denuncia CASCADE CONSTRAINTS;
DROP TABLE Resposta CASCADE CONSTRAINTS;
DROP TABLE Feedback CASCADE CONSTRAINTS;
DROP TABLE Usuario CASCADE CONSTRAINTS;
DROP TABLE Registro_Especialidade CASCADE CONSTRAINTS;
DROP TABLE Especialidade CASCADE CONSTRAINTS;
DROP TABLE Registro CASCADE CONSTRAINTS;
DROP TABLE Tipo_Registro CASCADE CONSTRAINTS;
DROP TABLE Uf CASCADE CONSTRAINTS;
DROP TABLE Pessoa_Fisica CASCADE CONSTRAINTS;
DROP TABLE Pessoa CASCADE CONSTRAINTS;

CREATE TABLE Pessoa (
    id_pessoa NUMBER(9) CONSTRAINT pk_id_pessoa PRIMARY KEY,
    nome_pessoa VARCHAR(255) CONSTRAINT nn_nome_pessoa NOT NULL,
    imagem_pessoa VARCHAR(255)
);

CREATE TABLE Pessoa_Fisica (
    cpf_pf VARCHAR(25) CONSTRAINT pk_cpf_pf PRIMARY KEY,
    id_pessoa NUMBER(9) CONSTRAINT fk_pessoa_pf REFERENCES Pessoa(id_pessoa) CONSTRAINT nn_pessoa_pf NOT NULL
);

CREATE TABLE Uf (
    id_uf NUMBER(9) CONSTRAINT pk_id_uf PRIMARY KEY,
    sigla_uf VARCHAR(2) CONSTRAINT uk_sigla_uf UNIQUE CONSTRAINT nn_sigla_uf NOT NULL
);

CREATE TABLE Tipo_Registro (
    id_tipo_registro NUMBER(9) CONSTRAINT pk_id_tipo_registro PRIMARY KEY,
    nome_tipo_registro VARCHAR(255) CONSTRAINT uk_nome_tipo_registro UNIQUE CONSTRAINT nn_nome_tipo_registro NOT NULL
);

CREATE TABLE Registro (
    id_registro NUMBER(9) CONSTRAINT pk_id_registro PRIMARY KEY,
    numero_registro VARCHAR(255) CONSTRAINT nn_numero_registro NOT NULL,
    id_uf NUMBER(9) CONSTRAINT fk_registro_uf REFERENCES Uf(id_uf),
    id_tipo_registro NUMBER(9) CONSTRAINT fk_registro_tipo_registro REFERENCES Tipo_Registro(id_tipo_registro),
    id_pessoa NUMBER(9) CONSTRAINT fk_registro_pessoa REFERENCES Pessoa(id_pessoa)
);

CREATE TABLE Especialidade (
    id_especialidade NUMBER(9) CONSTRAINT pk_id_especialidade PRIMARY KEY,
    nome_especialidade VARCHAR(255) CONSTRAINT uk_nome_especialidade UNIQUE CONSTRAINT nn_nome_especialidade NOT NULL
);

CREATE TABLE Registro_Especialidade (
    id_registro NUMBER(9) CONSTRAINT fk_registro_especialidade_registro REFERENCES Registro(id_registro) CONSTRAINT nn_registro_especialidade NOT NULL,
    id_especialidade NUMBER(9) CONSTRAINT fk_registro_especialidade_especialidade REFERENCES Especialidade(id_especialidade) CONSTRAINT nn_especialidade_especialidade NOT NULL,
    CONSTRAINT pk_registro_especialidade PRIMARY KEY (id_registro, id_especialidade)
);

CREATE TABLE Usuario (
    id_usuario NUMBER(9) CONSTRAINT pk_id_usuario PRIMARY KEY,
    email_usuario VARCHAR(255) CONSTRAINT nn_email_usuario NOT NULL,
    senha_usuario VARCHAR(255) CONSTRAINT nn_senha_usuario NOT NULL,
    id_pessoa NUMBER(9) CONSTRAINT fk_usuario_pessoa REFERENCES Pessoa(id_pessoa),
    CONSTRAINT uk_usuario_email UNIQUE (id_pessoa, email_usuario)
);

CREATE TABLE Feedback (
    id_feedback NUMBER(9) CONSTRAINT pk_id_feedback PRIMARY KEY,
    data_feedback DATE CONSTRAINT nn_data_feedback NOT NULL,
    titulo_feedback VARCHAR(255) CONSTRAINT nn_titulo_feedback NOT NULL,
    descricao_feedback VARCHAR(255) CONSTRAINT nn_descricao_feedback NOT NULL,
    nota_feedback NUMBER(4,2),
    id_paciente NUMBER(9) CONSTRAINT fk_feedback_paciente REFERENCES Pessoa(id_pessoa),
    id_registro NUMBER(9) CONSTRAINT fk_feedback_registro REFERENCES Registro(id_registro),
    is_anonimo NUMBER(1) CONSTRAINT nn_is_anonimo NOT NULL
);

CREATE TABLE Resposta (
    id_resposta NUMBER(9) CONSTRAINT pk_id_resposta PRIMARY KEY,
    data_resposta DATE CONSTRAINT nn_data_resposta NOT NULL,
    descricao_resposta VARCHAR(255) CONSTRAINT nn_descricao_resposta NOT NULL,
    id_usuario NUMBER(9) CONSTRAINT fk_resposta_usuario REFERENCES Usuario(id_usuario),
    id_feedback NUMBER(9) CONSTRAINT fk_resposta_feedback REFERENCES Feedback(id_feedback)
);

CREATE TABLE Tipo_Denuncia (
    id_tipo_denuncia NUMBER(9) CONSTRAINT pk_id_tipo_denuncia PRIMARY KEY,
    nome_tipo_denuncia VARCHAR(255) CONSTRAINT uk_nome_tipo_denuncia UNIQUE CONSTRAINT nn_nome_tipo_denuncia NOT NULL
);

CREATE TABLE Denuncia (
    id_tipo_denuncia NUMBER(9) CONSTRAINT fk_denuncia_tipo_denuncia REFERENCES Tipo_Denuncia(id_tipo_denuncia) CONSTRAINT nn_id_tipo_denuncia NOT NULL,
    acao_tomada_denuncia VARCHAR(255),
    evidencia_denuncia VARCHAR(255),
    id_feedback NUMBER(9) CONSTRAINT fk_denuncia_feedback REFERENCES Feedback(id_feedback) CONSTRAINT pk_id_feedback_denuncia PRIMARY KEY
);

-- 2. Carga de Dados 

//Pessoa

CREATE SEQUENCE seq_pessoa
START WITH 1
INCREMENT BY 1;

DECLARE
    v_id_pessoa Pessoa.id_pessoa%TYPE;
    v_nome_pessoa Pessoa.nome_pessoa%TYPE;
    v_imagem_pessoa Pessoa.imagem_pessoa%TYPE;

BEGIN
    SELECT seq_pessoa.NEXTVAL INTO v_id_pessoa FROM DUAL;

    v_nome_pessoa := '&nome_pessoa';
    v_imagem_pessoa := '&imagem_pessoa';

    INSERT INTO Pessoa (id_pessoa, nome_pessoa, imagem_pessoa)
    VALUES (v_id_pessoa, v_nome_pessoa, v_imagem_pessoa);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Dados inseridos com sucesso. ID da Pessoa: ' || v_id_pessoa);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM PESSOA;

// PessoaFisica

DECLARE
    v_cpf_pf Pessoa_Fisica.cpf_pf%TYPE;
    v_id_pessoa Pessoa_Fisica.id_pessoa%TYPE;
    v_contagem NUMBER;

BEGIN
    v_cpf_pf := '&cpf_pf';
    v_id_pessoa := &id_pessoa;

    IF LENGTH(v_cpf_pf) != 11 THEN
        RAISE_APPLICATION_ERROR(-20001, 'CPF deve ter 11 dígitos.');
    END IF;

    SELECT COUNT(*) INTO v_contagem FROM Pessoa_Fisica WHERE id_pessoa = v_id_pessoa;
    IF v_contagem > 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Este ID de pessoa já está associado a uma Pessoa Física.');
    END IF;

    INSERT INTO Pessoa_Fisica (cpf_pf, id_pessoa)
    VALUES (v_cpf_pf, v_id_pessoa);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Dados inseridos com sucesso. CPF: ' || v_cpf_pf);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM Pessoa_Fisica;

// UF

CREATE SEQUENCE seq_uf
START WITH 1
INCREMENT BY 1;

DECLARE
    v_sigla_uf Uf.sigla_uf%TYPE;
    v_id_uf Uf.id_uf%TYPE;
    v_contagem NUMBER;

BEGIN
    SELECT seq_uf.NEXTVAL INTO v_id_uf FROM DUAL;

    v_sigla_uf := '&sigla_uf';

    SELECT COUNT(*) INTO v_contagem FROM Uf WHERE sigla_uf = UPPER(v_sigla_uf);
    IF v_contagem > 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Esta sigla de UF já existe.');
    END IF;

    INSERT INTO Uf (id_uf, sigla_uf)
    VALUES (v_id_uf, UPPER(v_sigla_uf));
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Dados inseridos com sucesso. Sigla da UF: ' || v_sigla_uf);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM Uf;

// TipoRegistro

CREATE SEQUENCE seq_tipo_registro
START WITH 1
INCREMENT BY 1;

DECLARE
    v_nome_tipo_registro Tipo_Registro.nome_tipo_registro%TYPE;
    v_id_tipo_registro Tipo_Registro.id_tipo_registro%TYPE;
    v_contagem NUMBER;

BEGIN
    SELECT seq_tipo_registro.NEXTVAL INTO v_id_tipo_registro FROM DUAL;

    v_nome_tipo_registro := '&nome_tipo_registro';

    SELECT COUNT(*) INTO v_contagem FROM Tipo_Registro WHERE UPPER(nome_tipo_registro) = UPPER(v_nome_tipo_registro);
    IF v_contagem > 0 THEN
        RAISE_APPLICATION_ERROR(-20004, 'Este nome de Tipo de Registro já existe.');
    END IF;

    INSERT INTO Tipo_Registro (id_tipo_registro, nome_tipo_registro)
    VALUES (v_id_tipo_registro, v_nome_tipo_registro);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Dados inseridos com sucesso. ID do Tipo de Registro: ' || v_id_tipo_registro);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM Tipo_Registro;


// Registro

CREATE SEQUENCE seq_registro
START WITH 1
INCREMENT BY 1;

DECLARE
    v_numero_registro Registro.numero_registro%TYPE;
    v_id_uf Registro.id_uf%TYPE;
    v_id_tipo_registro Registro.id_tipo_registro%TYPE;
    v_id_pessoa Registro.id_pessoa%TYPE;
    v_id_registro Registro.id_registro%TYPE;
    v_contagem NUMBER;

BEGIN
    SELECT seq_registro.NEXTVAL INTO v_id_registro FROM DUAL;

    v_numero_registro := '&numero_registro';
    v_id_uf := &id_uf;
    v_id_tipo_registro := &id_tipo_registro;
    v_id_pessoa := &id_pessoa;

    SELECT COUNT(*) INTO v_contagem FROM Registro WHERE id_pessoa = v_id_pessoa;
    IF v_contagem > 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Este ID de Pessoa já está associado a um Registro.');
    END IF;

    INSERT INTO Registro (id_registro, numero_registro, id_uf, id_tipo_registro, id_pessoa)
    VALUES (v_id_registro, v_numero_registro, v_id_uf, v_id_tipo_registro, v_id_pessoa);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Dados inseridos com sucesso. ID do Registro: ' || v_id_registro);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM Registro;


// Especialidade

CREATE SEQUENCE seq_especialidade
START WITH 1
INCREMENT BY 1;

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

SELECT * FROM Especialidade;

// RegistroEspecialidade

CREATE SEQUENCE seq_registro_especialidade
START WITH 1
INCREMENT BY 1;

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

SELECT * FROM Registro_Especialidade;

// Usuario

CREATE SEQUENCE seq_usuario
START WITH 1
INCREMENT BY 1;

DECLARE
    v_email_usuario Usuario.email_usuario%TYPE;
    v_senha_usuario Usuario.senha_usuario%TYPE;
    v_id_pessoa Usuario.id_pessoa%TYPE;
    v_id_usuario Usuario.id_usuario%TYPE;
    v_contagem_email NUMBER;
    v_contagem_pessoa NUMBER;

BEGIN
    SELECT seq_usuario.NEXTVAL INTO v_id_usuario FROM DUAL;

    v_email_usuario := '&email_usuario';
    v_senha_usuario := '&senha_usuario';
    v_id_pessoa := &id_pessoa;

    SELECT COUNT(*) INTO v_contagem_email FROM Usuario WHERE email_usuario = v_email_usuario;
    IF v_contagem_email > 0 THEN
        RAISE_APPLICATION_ERROR(-20008, 'Este email já está cadastrado para um usuário.');
    END IF;

    SELECT COUNT(*) INTO v_contagem_pessoa FROM Usuario WHERE id_pessoa = v_id_pessoa;
    IF v_contagem_pessoa > 0 THEN
        RAISE_APPLICATION_ERROR(-20009, 'Este ID de pessoa já está associado a um usuário.');
    END IF;

    INSERT INTO Usuario (id_usuario, email_usuario, senha_usuario, id_pessoa)
    VALUES (v_id_usuario, v_email_usuario, v_senha_usuario, v_id_pessoa);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Usuário inserido com sucesso. ID do Usuário: ' || v_id_usuario);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM Usuario;

// Feedback

CREATE SEQUENCE seq_feedback
START WITH 1
INCREMENT BY 1;

DECLARE
    v_data_feedback Feedback.data_feedback%TYPE;
    v_titulo_feedback Feedback.titulo_feedback%TYPE;
    v_descricao_feedback Feedback.descricao_feedback%TYPE;
    v_nota_feedback Feedback.nota_feedback%TYPE;
    v_id_paciente NUMBER;
    v_id_registro Feedback.id_registro%TYPE;
    v_is_anonimo Feedback.is_anonimo%TYPE;
    v_id_feedback Feedback.id_feedback%TYPE;
    v_contagem_registro NUMBER;

BEGIN
    SELECT seq_feedback.NEXTVAL INTO v_id_feedback FROM DUAL;

    v_data_feedback := TO_DATE('&data_feedback', 'DD/MM/YYYY');
    v_titulo_feedback := '&titulo_feedback';
    v_descricao_feedback := '&descricao_feedback';
    v_nota_feedback := &nota_feedback;
    v_id_paciente := &id_paciente;
    v_id_registro := &id_registro; 
    v_is_anonimo := &is_anonimo;

    SELECT COUNT(*) INTO v_contagem_registro FROM Registro WHERE id_pessoa = v_id_paciente;
    IF v_contagem_registro > 0 THEN
        RAISE_APPLICATION_ERROR(-20010, 'Este ID de Pessoa está associado a um médico e não pode dar feedback como paciente.');
    END IF;

    INSERT INTO Feedback (id_feedback, data_feedback, titulo_feedback, descricao_feedback, nota_feedback, id_paciente, id_registro, is_anonimo)
    VALUES (v_id_feedback, v_data_feedback, v_titulo_feedback, v_descricao_feedback, v_nota_feedback, v_id_paciente, v_id_registro, v_is_anonimo);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Feedback inserido com sucesso. ID do Feedback: ' || v_id_feedback);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM Feedback;

// Resposta

CREATE SEQUENCE seq_resposta
START WITH 1
INCREMENT BY 1;

DECLARE
    v_data_resposta Resposta.data_resposta%TYPE;
    v_descricao_resposta Resposta.descricao_resposta%TYPE;
    v_id_usuario Resposta.id_usuario%TYPE;
    v_id_feedback Resposta.id_feedback%TYPE;
    v_id_resposta Resposta.id_resposta%TYPE;
    v_id_pessoa NUMBER;
    v_contagem_registro NUMBER;

BEGIN
    SELECT seq_resposta.NEXTVAL INTO v_id_resposta FROM DUAL;

    v_data_resposta := TO_DATE('&data_resposta', 'DD/MM/YYYY');
    v_descricao_resposta := '&descricao_resposta';
    v_id_usuario := &id_usuario;
    v_id_feedback := &id_feedback;

    SELECT id_pessoa INTO v_id_pessoa FROM Usuario WHERE id_usuario = v_id_usuario;
    SELECT COUNT(*) INTO v_contagem_registro FROM Registro WHERE id_pessoa = v_id_pessoa;

    IF v_contagem_registro = 0 THEN
        RAISE_APPLICATION_ERROR(-20012, 'O usuário não está associado a um médico e não pode responder.');
    END IF;

    INSERT INTO Resposta (id_resposta, data_resposta, descricao_resposta, id_usuario, id_feedback)
    VALUES (v_id_resposta, v_data_resposta, v_descricao_resposta, v_id_usuario, v_id_feedback);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Resposta inserida com sucesso. ID da Resposta: ' || v_id_resposta);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM Resposta;

// TipoDenuncia

CREATE SEQUENCE seq_tipo_denuncia
START WITH 1
INCREMENT BY 1;

DECLARE
    v_nome_tipo_denuncia Tipo_Denuncia.nome_tipo_denuncia%TYPE;
    v_id_tipo_denuncia Tipo_Denuncia.id_tipo_denuncia%TYPE;
    v_contagem NUMBER;

BEGIN
    SELECT seq_tipo_denuncia.NEXTVAL INTO v_id_tipo_denuncia FROM DUAL;

    v_nome_tipo_denuncia := '&nome_tipo_denuncia';

    SELECT COUNT(*) INTO v_contagem FROM Tipo_Denuncia WHERE UPPER(nome_tipo_denuncia) = UPPER(v_nome_tipo_denuncia);
    IF v_contagem > 0 THEN
        RAISE_APPLICATION_ERROR(-20013, 'Este nome de Tipo de Denúncia já existe.');
    END IF;

    INSERT INTO Tipo_Denuncia (id_tipo_denuncia, nome_tipo_denuncia)
    VALUES (v_id_tipo_denuncia, v_nome_tipo_denuncia);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Tipo de Denúncia inserido com sucesso. ID do Tipo de Denúncia: ' || v_id_tipo_denuncia);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM Tipo_Denuncia;

// Denuncia

CREATE SEQUENCE seq_denuncia
START WITH 1
INCREMENT BY 1;

DECLARE
    v_id_tipo_denuncia Denuncia.id_tipo_denuncia%TYPE;
    v_acao_tomada_denuncia Denuncia.acao_tomada_denuncia%TYPE;
    v_evidencia_denuncia Denuncia.evidencia_denuncia%TYPE;
    v_id_feedback Denuncia.id_feedback%TYPE;

BEGIN
    v_id_tipo_denuncia := &id_tipo_denuncia;
    v_acao_tomada_denuncia := '&acao_tomada_denuncia';
    v_evidencia_denuncia := '&evidencia_denuncia';
    v_id_feedback := &id_feedback;

    INSERT INTO Denuncia (id_tipo_denuncia, acao_tomada_denuncia, evidencia_denuncia, id_feedback)
    VALUES (v_id_tipo_denuncia, v_acao_tomada_denuncia, v_evidencia_denuncia, v_id_feedback);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Denúncia inserida com sucesso.');

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocorreu um erro: ' || SQLERRM);
        ROLLBACK;
END;

SELECT * FROM Denuncia;

-- 3. Relatórios

//1 Relatório de Feedbacks e suas Respostas Correspondentes
DECLARE
    CURSOR c_feedbacks IS
        SELECT * FROM Feedback;
    
    v_feedback Feedback%ROWTYPE;

BEGIN
    OPEN c_feedbacks;

    LOOP
        FETCH c_feedbacks INTO v_feedback;
        EXIT WHEN c_feedbacks%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('Feedback ID: ' || v_feedback.id_feedback || ' - Título: ' || v_feedback.titulo_feedback);

        DECLARE
            CURSOR c_respostas IS
                SELECT * FROM Resposta WHERE id_feedback = v_feedback.id_feedback;

            v_resposta Resposta%ROWTYPE;
        BEGIN
            OPEN c_respostas;

            LOOP
                FETCH c_respostas INTO v_resposta;
                EXIT WHEN c_respostas%NOTFOUND;

                DBMS_OUTPUT.PUT_LINE('    Resposta ID: ' || v_resposta.id_resposta || ' - Descrição: ' || v_resposta.descricao_resposta);
            END LOOP;

            CLOSE c_respostas;
        END;
    END LOOP;

    CLOSE c_feedbacks;
END;

//2 Relatório de Detalhes de Respostas para um Feedback Específico
DECLARE
    v_id_feedback NUMBER := &id_feedback; -- Substitua pelo ID do feedback

    CURSOR c_respostas_feedback IS
        SELECT * FROM Resposta WHERE id_feedback = v_id_feedback;

    v_resposta Resposta%ROWTYPE;

BEGIN
    OPEN c_respostas_feedback;

    LOOP
        FETCH c_respostas_feedback INTO v_resposta;
        EXIT WHEN c_respostas_feedback%NOTFOUND;

        DBMS_OUTPUT.PUT_LINE('Resposta ID: ' || v_resposta.id_resposta || ' - Descrição: ' || v_resposta.descricao_resposta);
    END LOOP;

    CLOSE c_respostas_feedback;
END;


















