DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department(
id INT AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR (30) NOT NULL
);

CREATE TABLE employee_role ( 
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
title_role VARCHAR(30),
salary DECIMAL (10,2),
department_id INTEGER,
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER,
manager_id INTEGER,

FOREIGN KEY(role_id) REFERENCES employee_role(id),

FOREIGN KEY(manager_id) REFERENCES employee_role(id)
);