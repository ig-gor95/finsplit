--liquibase formatted sql

--changeset finsplit:004-convert-ids-to-uuid

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing foreign key constraint
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS fk_transactions_user;

-- Create temporary columns for UUIDs
ALTER TABLE users ADD COLUMN id_uuid UUID;
ALTER TABLE transactions ADD COLUMN id_uuid UUID;
ALTER TABLE transactions ADD COLUMN user_id_uuid UUID;

-- Generate UUIDs for existing records (if any)
UPDATE users SET id_uuid = uuid_generate_v4();
UPDATE transactions SET id_uuid = uuid_generate_v4();
UPDATE transactions t SET user_id_uuid = (SELECT u.id_uuid FROM users u WHERE u.id = t.user_id);

-- Drop old primary keys and foreign keys
ALTER TABLE transactions DROP CONSTRAINT transactions_pkey;
ALTER TABLE users DROP CONSTRAINT users_pkey;

-- Drop old id columns
ALTER TABLE transactions DROP COLUMN id;
ALTER TABLE transactions DROP COLUMN user_id;
ALTER TABLE users DROP COLUMN id;

-- Rename UUID columns to id
ALTER TABLE users RENAME COLUMN id_uuid TO id;
ALTER TABLE transactions RENAME COLUMN id_uuid TO id;
ALTER TABLE transactions RENAME COLUMN user_id_uuid TO user_id;

-- Set new primary keys
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE transactions ADD PRIMARY KEY (id);

-- Set NOT NULL constraints
ALTER TABLE users ALTER COLUMN id SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN id SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN user_id SET NOT NULL;

-- Re-create foreign key constraint
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id);

-- Recreate indexes with UUID
DROP INDEX IF EXISTS idx_transactions_user_id;
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

--rollback ALTER TABLE transactions DROP CONSTRAINT fk_transactions_user;
--rollback ALTER TABLE transactions DROP CONSTRAINT transactions_pkey;
--rollback ALTER TABLE users DROP CONSTRAINT users_pkey;
--rollback ALTER TABLE users ADD COLUMN id_old BIGSERIAL PRIMARY KEY;
--rollback ALTER TABLE transactions ADD COLUMN id_old BIGSERIAL PRIMARY KEY;
--rollback ALTER TABLE transactions ADD COLUMN user_id_old BIGINT;


