# Documentação das Classes

### Classe `Usuario`

Representa um usuário do sistema.


- `id_usuario` (NUMBER(9)): Identificador único do usuário (Chave Primária).
- `registros_usuario` (VARCHAR(255)): registros do usuário (Único, Não Nulo).
- `senha_usuario` (VARCHAR(255)): Senha do usuário (Não Nulo).
- `nome_usuario` (VARCHAR(255)): Nome do usuário (Não Nulo).
- `cpf_usuario` (CHAR(11)): CPF do usuário (Único, Não Nulo).
- `imagem_usuario` (VARCHAR(255)): Caminho da imagem do usuário.

### Classe `Registro`

Representa um registro profissional associado a um usuário.

- `id_registro` (NUMBER(9)): Identificador único do registro (Chave Primária).
- `numero_registro` (VARCHAR(255)): Número do registro (Não Nulo).
- `uf_registro` (CHAR(2)): Sigla da unidade federativa do registro (Não Nulo).
- `tipo_registro` (VARCHAR(255)): Tipo de registro (Não Nulo).
- `id_usuario` (NUMBER(9)): Chave estrangeira referenciando Usuario(id_usuario).

### Classe: `Feedback`

Representa um feedback associado a um usuário.

- `id_feedback` (NUMBER(9)): Identificador único do feedback (Chave Primária).
- `data_feedback` (DATE): Data do feedback (Não Nulo).
- `titulo_feedback` (VARCHAR(255)): Título do feedback (Não Nulo).
- `descricao_feedback` (VARCHAR(255)): Descrição do feedback (Não Nulo).
- `nota_feedback` (NUMBER(4,2)): Nota do feedback (Não Nulo).
- `id_paciente` (NUMBER(9)): Chave estrangeira referenciando Usuario(id_usuario).
- `id_registro` (NUMBER(9)): Chave estrangeira referenciando Registro(id_registro).
- `is_anonimo` (NUMBER(1)): Indicador de feedback anônimo (Não Nulo).
- `acao_tomada_feedback` (VARCHAR(255)): Ação tomada em resposta ao feedback.
- `evidencia_feedback` (VARCHAR(255)): Evidência relacionada ao feedback.
- `tipo_feedback` (VARCHAR(255)): Tipo de feedback (Não Nulo).

### Classe `Especialidade`

Representa uma especialidade disponível.

- `id_especialidade` (NUMBER(9)): Identificador único da especialidade (Chave Primária).
- `nome_especialidade` (VARCHAR(255)): Nome da especialidade (Único, Não Nulo).

### Classe `Resposta`

Representa uma resposta associada a um feedback e usuário.

- `id_resposta` (NUMBER(9)): Identificador único da resposta (Chave Primária).
- `data_resposta` (DATE): Data da resposta (Não Nulo).
- `descricao_resposta` (VARCHAR(255)): Descrição da resposta (Não Nulo).
- `id_usuario` (NUMBER(9)): Chave estrangeira referenciando Usuario(id_usuario).
- `id_feedback` (NUMBER(9)): Chave estrangeira referenciando Feedback(id_feedback).


---

### Exemplos de Requisições HTTP

Aqui estão exemplos de como interagir com a API usando os métodos HTTP (GET, POST, PUT, DELETE):

---
## Endpoint **Usuarios**


#### `GET /usuarios`

Lista todos os usuarios.

**Exemplo de retorno:**
```json
[
    {
    	"id": 1,
    	"nome": "Cadastrando Novo Usuario",
    	"registros": "novoregistros@hotmail.com",
    	"cpf": "43101167876",
    	"imagem": "nova_imagem"
    },
    {
    	"id": 2,
    	"nome": "Cadastrando Novo Usuario2",
    	"registros": "novoregistros2@hotmail.com",
    	"cpf": "43101167871",
    	"imagem": "nova_imagem2"
    }
]
```


#### `POST /usuarios`

Cadastra um usuario.

**Exemplo do body da requisição:**
```json
{
	"nome": "Cadastrando Novo Usuario",
	"registros": "novoregistros@hotmail.com",
	"senha": "123",
	"cpf": "43101167876",
	"imagem": "nova_imagem"
}

```

#### `UPDATE /usuarios/{id}`

Atualiza um usuario.

**Exemplo do body da requisição:**
```json
{
	"nome": "Editando Usuario",
	"registros": "registroseditado@gmail.com",
	"senha": "123456",
	"cpf": "43101167877",
	"imagem": "imagem_editada"
}

```

#### `DELETE /usuarios/{id}`

Deleta um usuario.

#### `GET /usuarios/feedbacks/{id}`

Lista todos os feedbacks de um usuario.

---

---
## Endpoint **Especialidade**


#### `GET /especialidadess`

Lista todas as especialidadess.

**Exemplo de retorno:**
```json
[
    {
        "id_especialidades": 1,
        "nome_especialidades": "Ortopedia"
    },
    {
        "id_especialidades": 2,
        "nome_especialidades": "Cardiologia",
    }
]

```


#### `POST /especialidades`

Cadastra uma especialidade.

**Exemplo do body da requisição:**
```json
{
  "nome": "Cadastrando Nova Especialidade"
}

```

#### `UPDATE /especialidades/{id}`

Atualiza uma especialidade.

**Exemplo do body da requisição:**
```json
{
  "nome": "Editando Especialidade Cadastrada"
}

```

#### `DELETE /especialidades/{id}`

Deleta uma especialidade.

---

## Endpoint **Registros**


#### `GET /registros`

Lista todos os registros.

**Exemplo de retorno:**
```json
[
    {
    	"id": 1,
    	"numero": "123456",
    	"tipoRegistro": "CRM",
    	"uf": "SP",
    	"usuario": {1},
    	"especialidades": [1]
    },
    {
    	"id": 2,
    	"numero": "654321",
    	"tipoRegistro": "CRF",
    	"uf": "SP",
    	"usuario": {2},
    	"especialidades": [2]
    }
]
```


#### `POST /registros`

Cadastra um registro.

**Exemplo do body da requisição:**
```json
{
	"numero": "123456",
	"uf": "SP",
	"tipoRegistro": "CRM",
	"idUsuario": 1,
	"idEspecialidades": [1]
}
```

#### `UPDATE /registros/{id}`

Atualiza um registro.

**Exemplo do body da requisição:**
```json
{
	"numero": "986543",
	"uf": "GO",
	"tipoRegistro": "CRF",
	"idUsuario": 1,
	"idEspecialidades": [1]
}
```

#### `DELETE /registros/{id}`

Deleta um registro.

#### `GET /registros/feedbacks/{id}`

Lista todos os feedbacks de registro.

#### `POST /registros/findOrCreate`

Busca ou cria um registro.

**Exemplo do body da requisição:**
```json
{
	  "numero": "123456",
	  "uf": "SP",
	  "tipoRegistro": "CRM"
}

```



---

## Endpoint **Feedback**


#### `GET /feedbacks`

Lista todos as feedbacks.

**Exemplo de retorno:**
```json
[
    {
    	"id": 1,
    	"data": "2023-02-22T00:00:00.000+00:00",
    	"titulo": "Cadastranto Titulo",
    	"descricao": "Cadastrando descricao",
    	"nota": 5,
    	"paciente": {1},
    	"registro": {1},
        "especialidades": [1],
    	"isAnonimo": false,
    	"acao": "Cadastrando acao",
    	"imagem": "cadastrando_imagem",
    	"tipo": "Cadastro tipo"
    },
    {
    	"id": 2,
    	"data": "2023-02-23T00:00:00.000+00:00",
    	"titulo": "Cadastranto Titulo2",
    	"descricao": "Cadastrando descricao2",
    	"nota": 4,
    	"paciente": {2},
    	"registro": {2},
        "especialidades": [2],
    	"isAnonimo": false,
    	"acao": "Cadastrando acao2",
    	"imagem": "cadastrando_imagem2",
    	"tipo": "Cadastro tipo2"
    },
]

```

#### `POST /feedbacks`

Cadastra uma feedback.

**Exemplo do body da requisição:**
```json
{
    "nome": "Cadastrando Novo Feedback",
	"data": "2023-02-22",
	"titulo": "Cadastranto Titulo",
	"descricao": "Cadastrando descricao",
	"nota": "5",
	"idPaciente": 1,
	"idRegistro": 1,
	"isAnonimo": false,
	"acao": "Cadastrando acao",
	"imagem": "cadastrando_imagem",
	"tipo": "Cadastro tipo"		
}
```

#### `UPDATE /feedbacks/{id}`

Atualiza uma feedback.

**Exemplo do body da requisição:**
```json
{
    "nome": "Atualizando Novo Feedback",
	"data": "2023-08-30",
	"titulo": "Atualizando Titulo",
	"descricao": "Atualizando descricao",
	"nota": "4",
	"idPaciente": 1,
	"idRegistro": 1,
	"isAnonimo": true,
	"acao": "Atualizando acao",
	"imagem": "atualizando_imagem",
	"tipo": "Atualizando tipo"	
}
```

#### `DELETE /feedbacks/{id}`

Deleta uma feedback.

---

## Endpoint **Respostas**


#### `GET /respostas`

Lista todas as respostas.

**Exemplo de retorno:**
```json
[
    {
			"id": 1,
			"data": "2023-02-22T00:00:00.000+00:00",
			"descricao": "Cadastrando descricao",
			"usuario": {1},
			"feedback": {
				"id": 1,
				"data": "2023-08-29",
				"titulo": "Atualizando Titulo",
				"descricao": "Atualizando descricao",
				"nota": 4.00,
				"paciente": {
					"id": 1,
					"nome": "Cadastrando Novo Usuario",
					"email": "novoemail@hotmail.com",
					"cpf": "43101167876",
					"imagem": "nova_imagem"
				},
				"registro": {
					"id": 2,
					"numero": "123456",
					"tipoRegistro": "CRM",
					"uf": "SP",
					"usuario": {
						"id": 1,
						"nome": "Cadastrando Novo Usuario",
						"email": "novoemail@hotmail.com",
						"cpf": "43101167876",
						"imagem": "nova_imagem"
					},
					"especialidades": [
						{
							"id": 1,
							"nome": "Cadastrando Nova Especialidade"
						}
					]
				},
				"isAnonimo": true,
				"acao": "Atualizando acao",
				"imagem": "atualizando_imagem",
				"tipo": "Atualizando tipo"
			}
		}
]
```


#### `POST /respostas`

Cadastra uma resposta.

**Exemplo do body da requisição:**
```json
{
    "data": "2023-02-22",
	"descricao": "Cadastrando descricao",
	"idUsuario": 1,
	"idFeedback": 1
}
```

#### `UPDATE /respostas/{id}`

Atualiza uma resposta.

**Exemplo do body da requisição:**
```json
{
    "data": "2023-08-30",
	"descricao": "Atualizando descricao",
	"idUsuario": 1,
	"idFeedback": 1
}
```

#### `DELETE /respostas/{id}`

Deleta uma resposta.

---

## Possíveis status code das requisições

| Código | Descrição
|-|-
| 200 | Requisição bem-sucedida
| 201 | Cadastrado com sucesso
| 204 | A requisição foi bem-sucedida, mas não há conteúdo para retornar.
| 400 | Os campos enviados são inválidos
| 404 | Página não encontrada
| 405 | Método não permitido
| 500 | Erro interno do servidor
