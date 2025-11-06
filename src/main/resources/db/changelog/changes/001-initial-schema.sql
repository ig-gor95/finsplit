--liquibase formatted sql

--changeset finsplit:001-create-users-table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

--changeset finsplit:002-create-transactions-table
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'RUB',
    transaction_date TIMESTAMP NOT NULL,
    category VARCHAR(100),
    merchant VARCHAR(255),
    transaction_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category);

--changeset finsplit:003-add-transaction-external-fields
ALTER TABLE transactions 
ADD COLUMN external_id VARCHAR(255),
ADD COLUMN document_number VARCHAR(100),
ADD COLUMN document_date DATE,
ADD COLUMN account_number VARCHAR(50),
ADD COLUMN recipient_name VARCHAR(500),
ADD COLUMN recipient_inn VARCHAR(50),
ADD COLUMN recipient_account VARCHAR(50),
ADD COLUMN payment_purpose TEXT,
ADD COLUMN source_file_name VARCHAR(255),
ADD COLUMN imported_at TIMESTAMP;

CREATE UNIQUE INDEX idx_transactions_external_id ON transactions(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX idx_transactions_document_number ON transactions(document_number);
CREATE INDEX idx_transactions_account_number ON transactions(account_number);

--changeset finsplit:005-create-accounts-table
CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    account_number VARCHAR(50) NOT NULL UNIQUE,
    client_name VARCHAR(500),
    inn VARCHAR(50),
    account_name VARCHAR(255),
    currency VARCHAR(3) NOT NULL DEFAULT 'RUB',
    last_statement_date DATE,
    current_balance DECIMAL(19,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);

--changeset finsplit:006-add-account-to-transactions
ALTER TABLE transactions ADD COLUMN account_id UUID;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);

--changeset finsplit:009-create-uploaded-files-table
CREATE TABLE uploaded_files (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    account_id UUID,
    file_name VARCHAR(255) NOT NULL,
    bank_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    total_transactions INTEGER NOT NULL,
    imported_transactions INTEGER NOT NULL,
    updated_transactions INTEGER NOT NULL,
    skipped_transactions INTEGER NOT NULL,
    errors TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_uploaded_files_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_uploaded_files_account FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE INDEX idx_uploaded_files_user_id ON uploaded_files(user_id);
CREATE INDEX idx_uploaded_files_account_id ON uploaded_files(account_id);
CREATE INDEX idx_uploaded_files_uploaded_at ON uploaded_files(uploaded_at);

--changeset finsplit:010-add-file-id-to-transactions
ALTER TABLE transactions ADD COLUMN file_id UUID;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_file FOREIGN KEY (file_id) REFERENCES uploaded_files(id);
CREATE INDEX idx_transactions_file_id ON transactions(file_id);

--changeset finsplit:011-create-account-balances-table
CREATE TABLE account_balances (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    balance_date DATE NOT NULL,
    currency VARCHAR(3) NOT NULL,
    balance_amount DECIMAL(19,2) NOT NULL,
    file_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_balances_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_account_balances_account FOREIGN KEY (account_id) REFERENCES accounts(id),
    CONSTRAINT fk_account_balances_file FOREIGN KEY (file_id) REFERENCES uploaded_files(id),
    CONSTRAINT uq_account_balance_date UNIQUE (account_id, balance_date)
);

CREATE INDEX idx_account_balances_user_id ON account_balances(user_id);
CREATE INDEX idx_account_balances_account_id ON account_balances(account_id);
CREATE INDEX idx_account_balances_balance_date ON account_balances(balance_date);
CREATE INDEX idx_account_balances_file_id ON account_balances(file_id);

