CREATE TABLE `user_management`.`users` ( `id` INT NOT NULL AUTO_INCREMENT , `first_name` VARCHAR(55) NOT NULL , `last_email` VARCHAR(55) NOT NULL , `email` VARCHAR(55) NOT NULL , `phone` VARCHAR(55) NOT NULL , `comments` TEXT NOT NULL , `status` VARCHAR(10) NOT NULL DEFAULT 'active' , PRIMARY KEY (`id`)) ENGINE = InnoDB;