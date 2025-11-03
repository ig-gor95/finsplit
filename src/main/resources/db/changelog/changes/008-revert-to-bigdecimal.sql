--liquibase formatted sql

--changeset finsplit:008-revert-to-bigdecimal

-- Revert transactions table to use BigDecimal
ALTER TABLE transactions ADD COLUMN amount DECIMAL(19,2);
UPDATE transactions SET amount = (micros / 1000000.0) WHERE micros IS NOT NULL;
ALTER TABLE transactions ALTER COLUMN amount SET NOT NULL;
ALTER TABLE transactions DROP COLUMN micros;

-- Revert accounts table to use BigDecimal
ALTER TABLE accounts ADD COLUMN current_balance DECIMAL(19,2);
UPDATE accounts SET current_balance = (balance_micros / 1000000.0) WHERE balance_micros IS NOT NULL;
ALTER TABLE accounts DROP COLUMN balance_micros;

--rollback ALTER TABLE transactions ADD COLUMN micros BIGINT;
--rollback UPDATE transactions SET micros = (amount * 1000000)::BIGINT;
--rollback ALTER TABLE transactions DROP COLUMN amount;
--rollback ALTER TABLE accounts ADD COLUMN balance_micros BIGINT;
--rollback UPDATE accounts SET balance_micros = (current_balance * 1000000)::BIGINT;
--rollback ALTER TABLE accounts DROP COLUMN current_balance;

