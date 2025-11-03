--liquibase formatted sql

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

--rollback DROP TABLE uploaded_files;

