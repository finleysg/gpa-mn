CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`accountId` varchar(255) NOT NULL,
	`providerId` varchar(255) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` timestamp,
	`refreshTokenExpiresAt` timestamp,
	`scope` text,
	`password` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` varchar(36) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`emailVerified` boolean NOT NULL DEFAULT false,
	`image` text,
	`phone` varchar(32),
	`notifyOnSubmission` boolean NOT NULL DEFAULT true,
	`notifyOnAssignment` boolean NOT NULL DEFAULT true,
	`adminLogin` boolean NOT NULL DEFAULT false,
	`deactivatedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `invitation_role` (
	`id` varchar(36) NOT NULL,
	`invitationId` varchar(36) NOT NULL,
	`roleId` varchar(36) NOT NULL,
	CONSTRAINT `invitation_role_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitation_role_invitationId_roleId_unique` UNIQUE(`invitationId`,`roleId`)
);
--> statement-breakpoint
CREATE TABLE `role` (
	`id` varchar(36) NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `role_id` PRIMARY KEY(`id`),
	CONSTRAINT `role_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
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
CREATE TABLE `applicationComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`userId` varchar(36) NOT NULL,
	`sectionCategory` enum('applicant_info','household','pre_adoption','home','current_pets','your_greyhound','vet_reference','personal_references','final_questions','general'),
	`body` text NOT NULL,
	`isSystemEvent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applicationComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `applicationMilestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`milestone` enum('screened','interviewed','approved','matched','match_presented','adopted') NOT NULL,
	`completedAt` timestamp NOT NULL,
	`notes` text,
	`userId` varchar(36) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applicationMilestones_id` PRIMARY KEY(`id`),
	CONSTRAINT `applicationId_milestone_idx` UNIQUE(`applicationId`,`milestone`)
);
--> statement-breakpoint
CREATE TABLE `applicationSections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`sectionKey` enum('applicant_info','household','pre_adoption','home','current_pets','your_greyhound','vet_reference','personal_references','final_questions') NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`data` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applicationSections_id` PRIMARY KEY(`id`),
	CONSTRAINT `applicationId_sectionKey_version_idx` UNIQUE(`applicationId`,`sectionKey`,`version`)
);
--> statement-breakpoint
CREATE TABLE `applicationTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`token` varchar(64) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applicationTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `applicationTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`phone` varchar(50),
	`status` enum('draft','submitted','in_review','approved','adopted','denied','on_hold') NOT NULL DEFAULT 'draft',
	`adoptionRep` varchar(36),
	`houndId` varchar(50),
	`houndName` varchar(255),
	`submittedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP INDEX `photoType_parentId_idx` ON `photos`;--> statement-breakpoint
ALTER TABLE `contentItems` MODIFY COLUMN `contentType` varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `startDate` date NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `endDate` date;--> statement-breakpoint
ALTER TABLE `events` ADD `recurrence` enum('once','weekly','monthly_by_date','monthly_by_weekday') DEFAULT 'once' NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `showUpcoming` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `photos` ADD `variant` enum('desktop','mobile','default') DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_invitedBy_user_id_fk` FOREIGN KEY (`invitedBy`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation_role` ADD CONSTRAINT `invitation_role_invitationId_invitation_id_fk` FOREIGN KEY (`invitationId`) REFERENCES `invitation`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation_role` ADD CONSTRAINT `invitation_role_roleId_role_id_fk` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_roleId_role_id_fk` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_assignedBy_user_id_fk` FOREIGN KEY (`assignedBy`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `applicationComments` ADD CONSTRAINT `applicationComments_applicationId_applications_id_fk` FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `applicationComments` ADD CONSTRAINT `applicationComments_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `applicationMilestones` ADD CONSTRAINT `applicationMilestones_applicationId_applications_id_fk` FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `applicationMilestones` ADD CONSTRAINT `applicationMilestones_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `applicationSections` ADD CONSTRAINT `applicationSections_applicationId_applications_id_fk` FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `applicationTokens` ADD CONSTRAINT `applicationTokens_applicationId_applications_id_fk` FOREIGN KEY (`applicationId`) REFERENCES `applications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `applications` ADD CONSTRAINT `applications_adoptionRep_user_id_fk` FOREIGN KEY (`adoptionRep`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `photoType_parentId_variant_idx` ON `photos` (`photoType`,`parentId`,`variant`);--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `date`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `sortOrder`;