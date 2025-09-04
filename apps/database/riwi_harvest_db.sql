CREATE DATABASE IF NOT EXISTS riwi_harvest_db;
USE riwi_harvest_db;

-- =============================
-- tables with strong hierarchy
-- =============================

CREATE TABLE `institutions` (
	`id_institution` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id_institution`)
);

CREATE TABLE `cohorts` (
	`id_cohort` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`id_institution` INTEGER NOT NULL,
	PRIMARY KEY(`id_cohort`)
);

CREATE TABLE `shifts` (
	`id_shift` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`id_cohort` INTEGER NOT NULL,
	PRIMARY KEY(`id_shift`)
);

CREATE TABLE `categories` (
	`id_category` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`id_shift` INTEGER NOT NULL,
	PRIMARY KEY(`id_category`)
);

CREATE TABLE `courses` (
	`id_course` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`short_name` VARCHAR(255) NOT NULL,
	`date_begin` DATE,
	`date_end` DATE,
	`created_at` DATETIME NOT NULL,
	`id_category` INTEGER NOT NULL,
	PRIMARY KEY(`id_course`)
);

CREATE TABLE `modules` (
	`id_module` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`restricted` BOOLEAN NOT NULL DEFAULT TRUE,
	`hidden` BOOLEAN NOT NULL DEFAULT TRUE,
	`id_course` INTEGER NOT NULL,
	PRIMARY KEY(`id_module`)
);


-- ======================================
-- tables with weak hierarchy/modifiable
-- ======================================


CREATE TABLE `tasks` (
	`id_task` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`type` ENUM('Module assessment', 'Training', 'Review'),
	`id_module` INTEGER NOT NULL,
	PRIMARY KEY(`id_task`)
);

CREATE TABLE `coders` (
	`id_coder` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`full_name` VARCHAR(100) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`lastname` VARCHAR(50),
	`id` VARCHAR(20) NOT NULL UNIQUE,
	`email` VARCHAR(100) NOT NULL UNIQUE,
	`phone` VARCHAR(40),
	`gender` ENUM('masculino', 'femenino', 'otro') NOT NULL,
	`inscription_status` ENUM('Activo', 'Suspendido') NOT NULL,
	`city` VARCHAR(100),
	`inscription_date_begin` DATETIME NOT NULL,
	`inscription_date_end` DATETIME,
	`photo` TEXT ,
	`id_clan` VARCHAR(255),
	`id_role` INTEGER,
	PRIMARY KEY(`id_coder`)
);

CREATE TABLE `clans` (
	`id_clan` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id_clan`)
);

CREATE TABLE `roles` (
	`id_role` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id_role`)
);

CREATE TABLE `courses_coders` (
	`student_progress` DECIMAL(5,2) NOT NULL,
	`student_grade` DECIMAL(5,2),
	`id_coder` INTEGER NOT NULL,
	`id_course` INTEGER NOT NULL,
	PRIMARY KEY(`id_coder`, `id_course`)
);

CREATE TABLE `tasks_coders` (
	`id_task` INTEGER NOT NULL,
	`id_coder` INTEGER NOT NULL,
	`grade` DECIMAL(5,2),
	`feedback` TEXT,
	PRIMARY KEY(`id_task`, `id_coder`)
);


-- ============
-- Connections
-- ============


ALTER TABLE `tasks`
ADD FOREIGN KEY(`id_module`) REFERENCES `modules`(`id_module`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `modules`
ADD FOREIGN KEY(`id_course`) REFERENCES `courses`(`id_course`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `courses`
ADD FOREIGN KEY(`id_category`) REFERENCES `categories`(`id_category`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `categories`
ADD FOREIGN KEY(`id_shift`) REFERENCES `shifts`(`id_shift`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `shifts`
ADD FOREIGN KEY(`id_cohort`) REFERENCES `cohorts`(`id_cohort`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `cohorts`
ADD FOREIGN KEY(`id_institution`) REFERENCES `institutions`(`id_institution`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `coders`
ADD FOREIGN KEY(`id_clan`) REFERENCES `clans`(`id_clan`)
ON UPDATE CASCADE ON DELETE SET NULL;


ALTER TABLE `courses_coders`
ADD FOREIGN KEY(`id_course`) REFERENCES `courses`(`id_course`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `courses_coders`
ADD FOREIGN KEY(`id_coder`) REFERENCES `coders`(`id_coder`)
ON UPDATE CASCADE ON DELETE CASCADE;


ALTER TABLE `coders`
ADD FOREIGN KEY(`id_role`) REFERENCES `roles`(`id_role`)
ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE `tasks_coders`
ADD FOREIGN KEY(`id_task`) REFERENCES `tasks`(`id_task`)
ON UPDATE NO ACTION ON DELETE CASCADE;
ALTER TABLE `tasks_coders`
ADD FOREIGN KEY(`id_coder`) REFERENCES `coders`(`id_coder`)
ON UPDATE NO ACTION ON DELETE CASCADE;


