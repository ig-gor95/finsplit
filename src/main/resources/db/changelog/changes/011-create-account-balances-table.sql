--liquibase formatted sql

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

--rollback DROP TABLE account_balances;


