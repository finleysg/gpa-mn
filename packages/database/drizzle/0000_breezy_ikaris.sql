CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`date` varchar(255) NOT NULL,
	`time` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`type` enum('Annual','Fundraiser','Monthly','Weekly','Seasonal','Special') NOT NULL,
	`description` text NOT NULL,
	`longDescription` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`archived` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentType` enum('sectionHeader','adoptionStep','volunteerRole','donationOption') NOT NULL,
	`slug` varchar(255) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`archived` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contentItems_id` PRIMARY KEY(`id`),
	CONSTRAINT `contentType_slug_idx` UNIQUE(`contentType`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `contentVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentItemId` int NOT NULL,
	`version` int NOT NULL,
	`data` json NOT NULL,
	`createdBy` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`changeNote` text,
	CONSTRAINT `contentVersions_id` PRIMARY KEY(`id`),
	CONSTRAINT `contentItemId_version_idx` UNIQUE(`contentItemId`,`version`)
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`photoType` enum('event','content') NOT NULL,
	`parentId` int NOT NULL,
	`s3Key` varchar(512) NOT NULL,
	`originalFilename` varchar(255) NOT NULL,
	`contentType` varchar(100) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contentVersions` ADD CONSTRAINT `contentVersions_contentItemId_contentItems_id_fk` FOREIGN KEY (`contentItemId`) REFERENCES `contentItems`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `photoType_parentId_idx` ON `photos` (`photoType`,`parentId`);