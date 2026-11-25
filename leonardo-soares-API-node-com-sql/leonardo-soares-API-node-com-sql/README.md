# Construção de API REST com Node.js e MySQL

**Aluno:** Leonardo Soares  
**Turma:** Programação Web III (PW3)  
**Atividade:** Trabalho Prático — Construção de API REST com Node.js e MySQL  

---

## Sobre o Projeto

API REST completa desenvolvida em **Node.js** com **Express** e banco de dados **MySQL** sem o uso de ORMs, utilizando queries SQL diretas com *placeholders* (`?`) via driver nativo (`mysql2`) para prevenção contra SQL Injection, além de tratamento de exceções com `try/catch` e retornos HTTP adequados (`200`, `201`, `400`, `404`, `500`).

---

## Estrutura de Arquivos

```text
leonardo-soares-API-node-com-sql/
├── .env.example     # Modelo das variáveis de ambiente (sem senhas reais)
├── .gitignore       # Ignora node_modules/ e .env no versionamento
├── db.js            # Configuração do pool de conexões com MySQL
├── package.json     # Dependências (express, mysql2, dotenv, cors) e scripts
├── README.md        # Documentação do projeto
├── schema.sql       # Script DDL de criação do banco/tabela e dados iniciais
└── server.js        # Configuração do Express e rotas CRUD (/usuarios)
```

---

## Como Instalar e Executar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/Soaressvl/leonardo-soares-API-node-com-sql.git
cd leonardo-soares-API-node-com-sql
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie o arquivo `.env` a partir do modelo `.env.example` e preencha com as credenciais do seu servidor MySQL:
```bash
cp .env.example .env
```

### 4. Criar o banco de dados e a tabela
Importe o script `schema.sql` no seu MySQL:
```bash
mysql -u root -p < schema.sql
```

### 5. Rodar o servidor
Em modo de desenvolvimento (com `nodemon`):
```bash
npm run dev
```
Ou em modo padrão:
```bash
npm start
```

A API ficará disponível em `http://localhost:3000`.

---

## Rotas Disponíveis

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/usuarios` | Insere um novo registro com dados recebidos pelo `req.body` (`nome`, `email`, `idade`) |
| `GET` | `/usuarios` | Recupera e lista todos os registros salvos na tabela |
| `PUT` | `/usuarios/:id` | Atualiza campos de um registro específico identificado por `req.params.id` |
| `DELETE` | `/usuarios/:id` | Remove permanentemente do banco o registro informado no ID da URL |
