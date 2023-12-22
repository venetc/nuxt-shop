CREATE TABLE `brands` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `colors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hex` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `colors_of_models` (
	`model_id` integer NOT NULL,
	`color_id` integer NOT NULL,
	PRIMARY KEY(`color_id`, `model_id`),
	FOREIGN KEY (`model_id`) REFERENCES `models`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `models` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`stock_amount` integer DEFAULT 0 NOT NULL,
	`full_price` integer NOT NULL,
	`discount_price` integer,
	`image` text NOT NULL,
	`slug` text NOT NULL,
	`brand_id` integer,
	`rating` integer,
	`sort_index` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sizes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`size` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sizes_of_models` (
	`model_id` integer NOT NULL,
	`size_id` integer NOT NULL,
	PRIMARY KEY(`model_id`, `size_id`),
	FOREIGN KEY (`model_id`) REFERENCES `models`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`size_id`) REFERENCES `sizes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brands_name_unique` ON `brands` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `colors_hex_unique` ON `colors` (`hex`);--> statement-breakpoint
CREATE UNIQUE INDEX `models_slug_unique` ON `models` (`slug`);