--liquibase formatted sql

--changeset finsplit:005-create-accounts-table

-- Create accounts table
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

--rollback DROP TABLE accounts;

