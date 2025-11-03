--liquibase formatted sql

--changeset finsplit:010-add-file-id-to-transactions

-- Add file_id column to transactions
ALTER TABLE transactions ADD COLUMN file_id UUID;

-- Create foreign key constraint
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_file FOREIGN KEY (file_id) REFERENCES uploaded_files(id);

-- Create index
CREATE INDEX idx_transactions_file_id ON transactions(file_id);

--rollback ALTER TABLE transactions DROP CONSTRAINT fk_transactions_file;
--rollback ALTER TABLE transactions DROP COLUMN file_id;

