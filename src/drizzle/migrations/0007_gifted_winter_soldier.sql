ALTER TABLE "users" ALTER COLUMN "user_status" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_status" SET DEFAULT 'ACTIVE';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_status" SET NOT NULL;