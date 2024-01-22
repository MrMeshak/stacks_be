ALTER TABLE "stacks" RENAME COLUMN "projectId" TO "project_id";--> statement-breakpoint
ALTER TABLE "stacks" DROP CONSTRAINT "stacks_projectId_projects_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stacks" ADD CONSTRAINT "stacks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
