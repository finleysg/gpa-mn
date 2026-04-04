-- Migrate existing 'monthly' rows to 'monthly_by_date' before the enum is updated.
-- Run this BEFORE `pnpm db:push` which will alter the enum column.
--
-- Step 1: Add the new enum values while keeping 'monthly'
ALTER TABLE `events` MODIFY COLUMN `recurrence` enum('once','weekly','monthly','monthly_by_date','monthly_by_weekday') NOT NULL DEFAULT 'once';
--> statement-breakpoint
-- Step 2: Migrate existing data
UPDATE `events` SET `recurrence` = 'monthly_by_date' WHERE `recurrence` = 'monthly';
--> statement-breakpoint
-- Step 3: Remove the old 'monthly' value
ALTER TABLE `events` MODIFY COLUMN `recurrence` enum('once','weekly','monthly_by_date','monthly_by_weekday') NOT NULL DEFAULT 'once';
