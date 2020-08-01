USE employee_tracker_db;

INSERT INTO department (department_name) VALUES ("Drafting");
INSERT INTO department (department_name) VALUES ("Administration");
INSERT INTO department (department_name) VALUES ("Sales");
INSERT INTO department (department_name) VALUES ("R&D");
INSERT INTO department (department_name) VALUES ("Management");

INSERT INTO employee_role (title_role, salary, department_id) VALUES ("Architectural Draftsperson", 65000, 1);
INSERT INTO employee_role (title_role, salary, department_id) VALUES ("Client Administrator", 65000, 2);
INSERT INTO employee_role (title_role, salary, department_id) VALUES ("Group Display Home Coordinator", 70000, 2);
INSERT INTO employee_role (title_role, salary, department_id) VALUES ("Sales Consultant", 75000, 3);
INSERT INTO employee_role (title_role, salary, department_id) VALUES ("Senior Architectural Designer", 90000, 4);
INSERT INTO employee_role (title_role, salary, department_id) VALUES ("Design & Drafting Manager", 95000, 5);
INSERT INTO employee_role (title_role, salary, department_id) VALUES ("Sales Manager", 95000, 5);
INSERT INTO employee_role (title_role, salary, department_id) VALUES ("Administration Manager", 95000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Rocco", "San Jose", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ethan", "San Jose", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Mara", "San Jose", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jessica", "Armstrong", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Romano", "Fernandes", 4, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Rj", "San Jose", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Meg", "San Jose", 6, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Stuart", "Brown", 8, 2);
