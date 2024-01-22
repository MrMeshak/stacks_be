ALTER TABLE "projects" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stacks" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stacks" ALTER COLUMN "color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "stack_order" text[];--> statement-breakpoint
ALTER TABLE "stacks" ADD COLUMN "task_order" text[];--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "sub_task_order" text[];