-- Script DDL de criação do banco de dados e tabela + inserções de exemplo (PW3)
CREATE DATABASE IF NOT EXISTS pw3_api_sql
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pw3_api_sql;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  idade INT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserções de exemplo para testes iniciais
INSERT INTO usuarios (nome, email, idade) VALUES
  ('Leonardo Soares', 'leonardo.soares@exemplo.com', 22),
  ('Mariana Oliveira', 'mariana.oliveira@exemplo.com', 20),
  ('Carlos Eduardo Silva', 'carlos.silva@exemplo.com', 24)
ON DUPLICATE KEY UPDATE nome = VALUES(nome);
