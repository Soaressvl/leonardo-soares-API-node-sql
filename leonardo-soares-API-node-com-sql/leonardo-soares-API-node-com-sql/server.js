const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota inicial de status da API
app.get('/', (req, res) => {
  return res.status(200).json({
    sucesso: true,
    mensagem: 'API REST Node.js com MySQL rodando com sucesso.',
    autor: 'Leonardo Soares'
  });
});

// POST /usuarios - Insere um novo registro com dados recebidos pelo req.body
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, idade } = req.body;

    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O campo "nome" é obrigatório e deve conter ao menos 2 caracteres.'
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Informe um "email" válido.'
      });
    }

    const idadeTratada = idade !== undefined && idade !== null ? Number(idade) : null;

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nome, email, idade) VALUES (?, ?, ?)',
      [nome.trim(), email.trim().toLowerCase(), idadeTratada]
    );

    const [novoRegistro] = await pool.query(
      'SELECT id, nome, email, idade, criado_em, atualizado_em FROM usuarios WHERE id = ?',
      [resultado.insertId]
    );

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso.',
      dados: novoRegistro[0]
    });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Já existe um usuário cadastrado com este e-mail.'
      });
    }
    console.error('Erro ao inserir usuário:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao cadastrar usuário.'
    });
  }
});

// GET /usuarios - Recupera e lista todos os registros salvos na tabela
app.get('/usuarios', async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      'SELECT id, nome, email, idade, criado_em, atualizado_em FROM usuarios ORDER BY id ASC'
    );

    return res.status(200).json({
      sucesso: true,
      total: usuarios.length,
      dados: usuarios
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao listar usuários.'
    });
  }
});

// PUT /usuarios/:id - Atualiza campos de um registro específico identificado por req.params.id
app.put('/usuarios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ID inválido.'
      });
    }

    const { nome, email, idade } = req.body;
    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O campo "nome" é obrigatório e deve conter ao menos 2 caracteres.'
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Informe um "email" válido.'
      });
    }

    const idadeTratada = idade !== undefined && idade !== null ? Number(idade) : null;

    const [resultado] = await pool.query(
      'UPDATE usuarios SET nome = ?, email = ?, idade = ? WHERE id = ?',
      [nome.trim(), email.trim().toLowerCase(), idadeTratada, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado.'
      });
    }

    const [atualizado] = await pool.query(
      'SELECT id, nome, email, idade, criado_em, atualizado_em FROM usuarios WHERE id = ?',
      [id]
    );

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Usuário atualizado com sucesso.',
      dados: atualizado[0]
    });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Este e-mail já está em uso por outro usuário.'
      });
    }
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao atualizar usuário.'
    });
  }
});

// DELETE /usuarios/:id - Remove permanentemente do banco o registro informado no ID da URL
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'ID inválido.'
      });
    }

    const [resultado] = await pool.query(
      'DELETE FROM usuarios WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado.'
      });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Usuário removido com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao remover usuário.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
