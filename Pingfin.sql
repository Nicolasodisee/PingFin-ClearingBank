-- Maak de database aan als deze nog niet bestaat
CREATE DATABASE IF NOT EXISTS Pingfin;
USE Pingfin;

-- 1. Tabel: BANKS
CREATE TABLE IF NOT EXISTS BANKS (
    id VARCHAR(11) NOT NULL,
    name VARCHAR(255) NULL,
    description TEXT NULL,
    secret_key VARCHAR(255) NULL,
    token VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- 2. Tabel: LOGS
CREATE TABLE IF NOT EXISTS LOGS (
    id INT AUTO_INCREMENT NOT NULL,
    datetime DATETIME NULL,
    message TEXT NULL,
    type VARCHAR(50) NULL,
    po_id VARCHAR(50) NULL,
    po_amount DECIMAL(15, 2) NULL,
    po_message TEXT NULL,
    po_datetime DATETIME NULL,
    ob_id VARCHAR(11) NULL,
    oa_id VARCHAR(34) NULL,
    ob_code INT NULL,
    ob_datetime DATETIME NULL,
    cb_code INT NULL,
    cb_datetime DATETIME NULL,
    bb_id VARCHAR(11) NULL,
    ba_id VARCHAR(34) NULL,
    bb_code INT NULL,
    bb_datetime DATETIME NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- 3. Tabel: PO_IN
CREATE TABLE IF NOT EXISTS PO_IN (
    po_id VARCHAR(50) NOT NULL,
    po_amount DECIMAL(15, 2) NULL,
    po_message TEXT NULL,
    po_datetime DATETIME NULL,
    ob_id VARCHAR(11) NULL,
    oa_id VARCHAR(34) NULL,
    ob_code INT DEFAULT NULL,
    ob_datetime DATETIME DEFAULT NULL,
    cb_code INT DEFAULT NULL,
    cb_datetime DATETIME DEFAULT NULL,
    bb_id VARCHAR(11) NULL,
    ba_id VARCHAR(34) NULL,
    bb_code INT DEFAULT NULL,
    bb_datetime DATETIME DEFAULT NULL,
    PRIMARY KEY (po_id)
) ENGINE=InnoDB;

-- 4. Tabel: PO_OUT
CREATE TABLE IF NOT EXISTS PO_OUT (
    po_id VARCHAR(50) NOT NULL,
    po_amount DECIMAL(15, 2) NULL,
    po_message TEXT NULL,
    po_datetime DATETIME NULL,
    ob_id VARCHAR(11) NULL,
    oa_id VARCHAR(34) NULL,
    ob_code INT DEFAULT NULL,
    ob_datetime DATETIME DEFAULT NULL,
    cb_code INT DEFAULT NULL,
    cb_datetime DATETIME DEFAULT NULL,
    bb_id VARCHAR(11) NULL,
    ba_id VARCHAR(34) NULL,
    bb_code INT DEFAULT NULL,
    bb_datetime DATETIME DEFAULT NULL,
    PRIMARY KEY (po_id)
) ENGINE=InnoDB;

-- 5. Tabel: ACK_IN
CREATE TABLE IF NOT EXISTS ACK_IN (
    po_id VARCHAR(50) NOT NULL,
    po_amount DECIMAL(15, 2) NULL,
    po_message TEXT NULL,
    po_datetime DATETIME NULL,
    ob_id VARCHAR(11) NULL,
    oa_id VARCHAR(34) NULL,
    ob_code INT DEFAULT NULL,
    ob_datetime DATETIME DEFAULT NULL,
    cb_code INT DEFAULT NULL,
    cb_datetime DATETIME DEFAULT NULL,
    bb_id VARCHAR(11) NULL,
    ba_id VARCHAR(34) NULL,
    bb_code INT DEFAULT NULL,
    bb_datetime DATETIME DEFAULT NULL,
    PRIMARY KEY (po_id)
) ENGINE=InnoDB;

-- 6. Tabel: ACK_OUT
CREATE TABLE IF NOT EXISTS ACK_OUT (
    po_id VARCHAR(50) NOT NULL,
    po_amount DECIMAL(15, 2) NULL,
    po_message TEXT NULL,
    po_datetime DATETIME NULL,
    ob_id VARCHAR(11) NULL,
    oa_id VARCHAR(34) NULL,
    ob_code INT DEFAULT NULL,
    ob_datetime DATETIME DEFAULT NULL,
    cb_code INT DEFAULT NULL,
    cb_datetime DATETIME DEFAULT NULL,
    bb_id VARCHAR(11) NULL,
    ba_id VARCHAR(34) NULL,
    bb_code INT DEFAULT NULL,
    bb_datetime DATETIME DEFAULT NULL,
    PRIMARY KEY (po_id)
) ENGINE=InnoDB;