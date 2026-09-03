CREATE DATABASE IF NOT EXISTS inmobiliaria
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE inmobiliaria;

CREATE TABLE IF NOT EXISTS inmuebles (
  id INT UNSIGNED NOT NULL PRIMARY KEY,
  direccion VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  codigo_postal VARCHAR(30) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  precio DECIMAL(12, 2) NOT NULL,
  INDEX idx_ciudad (ciudad),
  INDEX idx_tipo (tipo),
  INDEX idx_precio (precio)
) ENGINE=InnoDB;
