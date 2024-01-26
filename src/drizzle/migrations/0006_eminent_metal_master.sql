DO $$ BEGIN
 CREATE TYPE "user_status" AS ENUM('ACTIVE', 'SUSPENDED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "completed" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "completed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_status" "user_status";