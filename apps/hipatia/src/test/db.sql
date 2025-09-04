-- https://www.drawdb.app/editor?shareId=685924f2207e2031872291d725e8433f

CREATE DATABASE riwi_harvest_test;

USE riwi_harvest_test;

CREATE TABLE `categories` (
	`id_category` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`id_shift` INTEGER NOT NULL,
	PRIMARY KEY(`id_category`)
);


CREATE TABLE `clan` (
	`id_clan` VARCHAR(255) NOT NULL UNIQUE,
	`created_at` DATETIME NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id_clan`)
);


CREATE TABLE `cohorts` (
	`id_cohort` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`id_institution` INTEGER NOT NULL,
	PRIMARY KEY(`id_cohort`)
);


CREATE TABLE `institutions` (
	`id_institution` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id_institution`)
);


CREATE TABLE `shifts` (
	`id_shift` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`id_cohort` INTEGER NOT NULL,
	PRIMARY KEY(`id_shift`)
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
	`id_course` INTEGER NOT NULL,
	PRIMARY KEY(`id_module`)
);


CREATE TABLE `coders` (
	`id_coder` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`user_full_name` VARCHAR(100) NOT NULL,
	`user_name` VARCHAR(50) NOT NULL,
	`user_lastname` VARCHAR(50),
	`user_number_id` VARCHAR(20) NOT NULL UNIQUE,
	`user_doc_type` ENUM('CC', 'TI', 'CE', 'PA', 'PPT', 'RC'),
	`user_email` VARCHAR(100) NOT NULL UNIQUE,
	`user_phone` VARCHAR(40) NOT NULL,
	`user_gender` ENUM('male', 'female', 'other') NOT NULL,
	`inscription_status` ENUM('Activo', 'Suspendido') NOT NULL,
	`user_city` VARCHAR(100) NOT NULL,
	`inscription_date_begin` DATETIME NOT NULL,
	`inscription_date_end` DATETIME,
	`id_clan` VARCHAR(255) NOT NULL,
	`id_role` INTEGER NOT NULL,
	PRIMARY KEY(`id_coder`)
);


CREATE TABLE `tasks` (
	`id_task` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`id_module` INTEGER NOT NULL,
	PRIMARY KEY(`id_task`)
);


CREATE TABLE `grades` (
	`id_grade` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`grade` DECIMAL(5,2) CHECK(grade BETWEEN 0 AND 100),
	`feedback` TEXT,
	`grade_type` ENUM('Module assessment', 'Training', 'Review'),
	`id_coder` INTEGER NOT NULL,
	`id_task` INTEGER NOT NULL,
	PRIMARY KEY(`id_grade`)
);


CREATE TABLE `courses_coders` (
	`id_courses_coders` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`student_progress` DECIMAL(5,2) NOT NULL,
	`student_grade` DECIMAL(5,2) NOT NULL,
	`id_coder` INTEGER NOT NULL,
	`id_course` INTEGER NOT NULL,
	PRIMARY KEY(`id_courses_coders`)
);


CREATE TABLE `roles` (
	`id_role` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id_role`)
);


ALTER TABLE `tasks`
ADD FOREIGN KEY(`id_module`) REFERENCES `modules`(`id_module`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `modules`
ADD FOREIGN KEY(`id_course`) REFERENCES `courses`(`id_course`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `courses`
ADD FOREIGN KEY(`id_category`) REFERENCES `categories`(`id_category`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `categories`
ADD FOREIGN KEY(`id_shift`) REFERENCES `shifts`(`id_shift`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `shifts`
ADD FOREIGN KEY(`id_cohort`) REFERENCES `cohorts`(`id_cohort`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `cohorts`
ADD FOREIGN KEY(`id_institution`) REFERENCES `institutions`(`id_institution`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `coders`
ADD FOREIGN KEY(`id_clan`) REFERENCES `clan`(`id_clan`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `courses_coders`
ADD FOREIGN KEY(`id_course`) REFERENCES `courses`(`id_course`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `courses_coders`
ADD FOREIGN KEY(`id_coder`) REFERENCES `coders`(`id_coder`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `grades`
ADD FOREIGN KEY(`id_task`) REFERENCES `tasks`(`id_task`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `grades`
ADD FOREIGN KEY(`id_coder`) REFERENCES `coders`(`id_coder`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `coders`
ADD FOREIGN KEY(`id_role`) REFERENCES `roles`(`id_role`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
