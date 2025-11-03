--liquibase formatted sql

--changeset finsplit:006-add-account-to-transactions

-- Add account_id column to transactions
ALTER TABLE transactions ADD COLUMN account_id UUID;

-- Create foreign key constraint
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id);

-- Create index
CREATE INDEX idx_transactions_account_id ON transactions(account_id);

--rollback ALTER TABLE transactions DROP CONSTRAINT fk_transactions_account;
--rollback ALTER TABLE transactions DROP COLUMN account_id;

