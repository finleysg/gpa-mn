-- Add deactivatedAt column to user table
ALTER TABLE `user` ADD `deactivatedAt` timestamp;
--> statement-breakpoint

-- Create role table
CREATE TABLE `role` (
	`id` varchar(36) NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `role_id` PRIMARY KEY(`id`),
	CONSTRAINT `role_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint

-- Create user_role join table
CREATE TABLE `user_role` (
	`id` varchar(36) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`roleId` varchar(36) NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	`assignedBy` varchar(36),
	CONSTRAINT `user_role_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_role_userId_roleId_unique` UNIQUE(`userId`,`roleId`)
);
--> statement-breakpoint

-- Create invitation table
CREATE TABLE `invitation` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`invitedBy` varchar(36) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`acceptedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invitation_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitation_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint

-- Create invitation_role join table
CREATE TABLE `invitation_role` (
	`id` varchar(36) NOT NULL,
	`invitationId` varchar(36) NOT NULL,
	`roleId` varchar(36) NOT NULL,
	CONSTRAINT `invitation_role_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitation_role_invitationId_roleId_unique` UNIQUE(`invitationId`,`roleId`)
);
--> statement-breakpoint

-- Add foreign keys
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_roleId_role_id_fk` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_assignedBy_user_id_fk` FOREIGN KEY (`assignedBy`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_invitedBy_user_id_fk` FOREIGN KEY (`invitedBy`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `invitation_role` ADD CONSTRAINT `invitation_role_invitationId_invitation_id_fk` FOREIGN KEY (`invitationId`) REFERENCES `invitation`(`id`) ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE `invitation_role` ADD CONSTRAINT `invitation_role_roleId_role_id_fk` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE no action ON UPDATE no action;
