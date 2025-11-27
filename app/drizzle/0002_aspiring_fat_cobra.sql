ALTER TABLE "user_sids" ALTER COLUMN "sid" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "user_sids" DROP COLUMN "hit_count";--> statement-breakpoint
ALTER TABLE "user_sids" DROP COLUMN "last_seen_at";--> statement-breakpoint
ALTER TABLE "user_sids" DROP COLUMN "is_blocked";--> statement-breakpoint
ALTER TABLE "user_sids" ADD CONSTRAINT "user_sid_unique" UNIQUE("user_id","sid");