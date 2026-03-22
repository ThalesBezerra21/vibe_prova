CREATE TABLE `provas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prova_id` integer NOT NULL,
	`enunciado` text NOT NULL,
	`option_a` text NOT NULL,
	`option_b` text NOT NULL,
	`option_c` text NOT NULL,
	`option_d` text NOT NULL,
	`correct_option` text NOT NULL,
	FOREIGN KEY (`prova_id`) REFERENCES `provas`(`id`) ON UPDATE no action ON DELETE cascade
);
