DROP SCHEMA IF EXISTS codeforces;
CREATE SCHEMA codeforces;
USE codeforces;
CREATE TABLE user(
    handle VARCHAR(63) PRIMARY KEY,
    email VARCHAR(255),
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    `rank` VARCHAR(30),
    rating INT
);

CREATE TABLE submission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `status` VARCHAR(3),
    problem VARCHAR(255),
    problem_url VARCHAR(255),
    user_handle VARCHAR(63),
    FOREIGN KEY (user_handle) REFERENCES user(handle)
);

DROP SCHEMA IF EXISTS atcoder;
CREATE SCHEMA atcoder;
USE atcoder;
CREATE TABLE user(
    handle VARCHAR(63) PRIMARY KEY,
    email VARCHAR(255),
    `rank` INT,
    rating INT
);

CREATE TABLE submission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `status` VARCHAR(3),
    problem VARCHAR(255),
    problem_url VARCHAR(255),
    user_handle VARCHAR(63),
    FOREIGN KEY (user_handle) REFERENCES user(handle)
);


DROP SCHEMA IF EXISTS topcoder;
CREATE SCHEMA topcoder;
USE topcoder;
CREATE TABLE user ( 
    handle VARCHAR(63) PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    city VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE submission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `status` VARCHAR(3),
    problem VARCHAR(255),
    problem_url VARCHAR(255),
    user_handle VARCHAR(63),
    FOREIGN KEY (user_handle) REFERENCES user(handle)
);
