--liquibase formatted sql

--changeset finsplit:003-add-transaction-external-fields
ALTER TABLE transactions 
ADD COLUMN external_id VARCHAR(255),
ADD COLUMN document_number VARCHAR(100),
ADD COLUMN document_date DATE,
ADD COLUMN account_number VARCHAR(50),
ADD COLUMN payer_name VARCHAR(500),
ADD COLUMN payer_inn VARCHAR(50),
ADD COLUMN payer_account VARCHAR(50),
ADD COLUMN recipient_name VARCHAR(500),
ADD COLUMN recipient_inn VARCHAR(50),
ADD COLUMN recipient_account VARCHAR(50),
ADD COLUMN payment_purpose TEXT,
ADD COLUMN source_file_name VARCHAR(255),
ADD COLUMN imported_at TIMESTAMP;

CREATE UNIQUE INDEX idx_transactions_external_id ON transactions(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX idx_transactions_document_number ON transactions(document_number);
CREATE INDEX idx_transactions_account_number ON transactions(account_number);

--rollback ALTER TABLE transactions DROP COLUMN external_id, DROP COLUMN document_number, DROP COLUMN document_date, DROP COLUMN account_number, DROP COLUMN payer_name, DROP COLUMN payer_inn, DROP COLUMN payer_account, DROP COLUMN recipient_name, DROP COLUMN recipient_inn, DROP COLUMN recipient_account, DROP COLUMN payment_purpose, DROP COLUMN source_file_name, DROP COLUMN imported_at;

