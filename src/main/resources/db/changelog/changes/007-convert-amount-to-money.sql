--liquibase formatted sql

--changeset finsplit:007-convert-amount-to-money

-- Update transactions table to use Money structure
-- Rename amount to micros and convert existing values
ALTER TABLE transactions ADD COLUMN micros BIGINT;
UPDATE transactions SET micros = (amount * 1000000)::BIGINT WHERE amount IS NOT NULL;
ALTER TABLE transactions ALTER COLUMN micros SET NOT NULL;
ALTER TABLE transactions DROP COLUMN amount;

-- Currency is already present, ensure it's NOT NULL
UPDATE transactions SET currency = 'RUB' WHERE currency IS NULL;
ALTER TABLE transactions ALTER COLUMN currency SET NOT NULL;

-- Update accounts table for current_balance
ALTER TABLE accounts ADD COLUMN balance_micros BIGINT;
UPDATE accounts SET balance_micros = (current_balance * 1000000)::BIGINT WHERE current_balance IS NOT NULL;
ALTER TABLE accounts DROP COLUMN current_balance;

-- Ensure currency is NOT NULL for accounts
UPDATE accounts SET currency = 'RUB' WHERE currency IS NULL;
ALTER TABLE accounts ALTER COLUMN currency SET NOT NULL;

--rollback ALTER TABLE transactions ADD COLUMN amount DECIMAL(19,2);
--rollback UPDATE transactions SET amount = (micros / 1000000.0);
--rollback ALTER TABLE transactions DROP COLUMN micros;
--rollback ALTER TABLE accounts ADD COLUMN current_balance DECIMAL(19,2);
--rollback UPDATE accounts SET current_balance = (balance_micros / 1000000.0);
--rollback ALTER TABLE accounts DROP COLUMN balance_micros;


