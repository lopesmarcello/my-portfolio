-- V2: Change resume.about column type from VARCHAR(255) to TEXT
-- This is idempotent on PostgreSQL: if the column is already TEXT the statement is a no-op
ALTER TABLE resume ALTER COLUMN about TYPE TEXT;
