-- Migration 001: criação das tabelas do VotoGeral 360
-- Execute este arquivo no servidor MySQL externo (mysql client, phpMyAdmin, etc.)

CREATE TABLE IF NOT EXISTS `funcionarios` (
  `id`         VARCHAR(40)  PRIMARY KEY,
  `nome`       VARCHAR(120) NOT NULL,
  `papel`      VARCHAR(60)  NOT NULL,
  `email`      VARCHAR(160),
  `telefone`   VARCHAR(40),
  `bairro`     VARCHAR(120),
  `ativo`      TINYINT(1)   DEFAULT 1,
  `entrou_em`  VARCHAR(40)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `liderancas` (
  `id`          VARCHAR(40) PRIMARY KEY,
  `nome`        VARCHAR(120) NOT NULL,
  `bairro`      VARCHAR(120),
  `telefone`    VARCHAR(40),
  `eleitores`   INT DEFAULT 0,
  `convertidos` INT DEFAULT 0,
  `meta`        INT DEFAULT 0,
  `engajamento` INT DEFAULT 0,
  `ativo`       TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `cabos` (
  `id`          VARCHAR(40) PRIMARY KEY,
  `nome`        VARCHAR(120) NOT NULL,
  `lideranca_id` VARCHAR(40),
  `regiao`      VARCHAR(120),
  `eleitores`   INT DEFAULT 0,
  `visitas`     INT DEFAULT 0,
  `meta`        INT DEFAULT 0,
  `performance` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `eleitores` (
  `id`                VARCHAR(40) PRIMARY KEY,
  `nome`              VARCHAR(120) NOT NULL,
  `cpf`               VARCHAR(20),
  `idade`             INT,
  `sexo`              VARCHAR(20),
  `cidade`            VARCHAR(80),
  `regiao`            VARCHAR(120),
  `bairro`            VARCHAR(120),
  `tipo_via`          VARCHAR(40),
  `numero`            VARCHAR(20),
  `endereco`          VARCHAR(200),
  `zona`              INT,
  `secao`             INT,
  `telefone`          VARCHAR(40),
  `email`             VARCHAR(160),
  `escolaridade`      VARCHAR(40),
  `apoio`             VARCHAR(20),
  `lideranca_id`      VARCHAR(40),
  `cabo_id`           VARCHAR(40),
  `cadastrado_em`     VARCHAR(40),
  `ultima_interacao`  VARCHAR(40)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `visitas` (
  `id`         VARCHAR(40) PRIMARY KEY,
  `eleitor_id` VARCHAR(40),
  `cabo_id`    VARCHAR(40),
  `data`       VARCHAR(40),
  `status`     VARCHAR(20),
  `motivo`     VARCHAR(120),
  `feedback`   TEXT,
  `protocolo`  VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
