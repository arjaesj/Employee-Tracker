USE employee_tracker_db;

INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Marketing");
INSERT INTO department (name) VALUES ("Legal");
INSERT INTO department (name) VALUES ("Finance");

INSERT INTO role (title, salary, department_id) VALUES ("Engineering Lead", 160, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Engineer", 100, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead", 100, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Salesperson", 45, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Legal Team Lead", 160, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Lawyer", 150, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Finance Team Lead", 100, 4);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant", 70, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Griffin", "Jones", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("James", "Jones", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tyler", "Nigro", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Amanda", "Fyle", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ethan", "Lewis", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Andrew", "Skorupa", 6, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Zach", "Crump", 7, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Thomas", "Gryb", 8, 7);
