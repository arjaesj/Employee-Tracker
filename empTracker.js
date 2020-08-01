const mysql = require("mysql");
const inquirer = require("inquirer");
require('dotenv').config()

// Create the connection to the mysql db with the following credentials. Used dotenv pakage to hide credentials.
const connection = mysql.createConnection({
    // Port used by mysql database
    port: 3306,
    host: "localhost",

    // my MySql database username
    user: "root",

    // my password saved in process.env
    password: process.env.PASSWORD,

    // my MySql database name
    database: "employeeTracker_db"

});

// initiate MySql connection
connection.connect(function(error) {
    if (error) {
        console.error("error connecting: " + error.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    init();
});

// function to start the CLI app
function init() {
    console.log("Welcome to the Employee Management System. Follow the prompts to use.")
    inquirer
        .prompt({
            name: "selections",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Employees",
                "View all Departments",
                "View all Job Title/Roles",
                "Add Department",
                "Add Employee Job Title/Role",
                "Add Employee",
                "Add Manager",
                "Update Employee Job Title/Role",
                "Delete Employee",
                "Delete Job Title/Role",
                "Delete Department",
                "Quit"
            ],
        })
        .then(({ selections }) => {
            switch (selections) {
                case "View all Employees":
                    viewEmployees();
                    break;
                case "View all Departments":
                    viewDepartments();
                    break;
                case "View all Job Title/Roles":
                    viewRoles();
                    break;
                case "Add Department":
                    addNewDepartment();
                    break;
                case "Add Employee Job Title/Role":
                    addNewTitleRole();
                    break;
                case "Add Employee":
                    addNewEmployee();
                    break;
                case "Add Manager":
                    addNewManager();
                    break;
                case "Update Employee Job Title/Role":
                    updateRole();
                    break;
                case "Delete Employee":
                    deleteEmployee();
                    break;
                    // case "Delete Job Title/Role":
                    //     deleteRole();
                    //     break;
                    // case "Delete Department":
                    //     deleteDepartment();
                    //     break;
                case "Quit":
                    quitApp();
                    break;

            }
        });
}

// function for viewing all departments in the database
const viewDepartments = () => {
    console.log("\n Here are all of the current Office Departments in the database... \n");
    connection.query("SELECT * FROM department", (error, response) => {
        if (error) throw error;
        console.table(response);
        console.log("\n \n");

        // invoking init function to make sure that we dont run into any async problems when pulling inquirer back up
        init();
    });
};

// function to view all job title or roles in the database
const viewRoles = () => {
    console.log("\n Here are all the of the current job Titles/Roles in the database... \n");
    connection.query("SELECT * FROM employee_role", (error, response) => {
        if (error) throw error;
        console.table(response);
        console.log("\n \n");

        // invoking init function to make sure that we dont run into any async problems when pulling inquirer back up
        init();
    });
};

// function to view all employees in the database
const viewEmployees = () => {
    console.log("\n Here are all the of the current Employees in the database... \n");

    // empty array for displaying the joined tables
    let joinedTablesArray = [];

    // database query variable to pass in as a parameter for the connection query
    let query =
        "SELECT employee.id, first_name, last_name, role_id, manager_id, title_role, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";
    connection.query(query, (error, response) => {
        if (error) throw error;

        // creating a loop through the query response and pushing every index to the empty array
        response.forEach(employee => {
            // variable with empty array to populate all employee data from the database
            let employeeArray = [];

            employeeArray.push(employee.id);
            employeeArray.push(employee.first_name);
            employeeArray.push(employee.last_name);
            employeeArray.push(employee.title);
            employeeArray.push(employee.salary);
            employeeArray.push(employee.name);

            // populated indexes in the employeeArray now pushed to the joinedTablesArray
            joinedTablesArray.push(employeeArray);
        });

        console.table(response);
        console.log("\n \n");

        // invoking init function to make sure that we dont run into any async problems when pulling inquirer back up
        init();
    });
};

// function to add a new office Department
const addNewDepartment = () => {
    inquirer
        .prompt([{
            name: "addNewDepartment",
            type: "input",
            message: "Type in the Department name you want to add.",
            //validation function so the user will have to input a valid string for the name
            validate: response => {
                if (response !== "") {
                    return true;
                } else {
                    return "Please type in valid input characters.";
                }
            },
        }, ])
        .then(answer => {
            console.log("Adding department... \n");
            connection.query(
                "INSERT INTO department SET ?", {
                    department_name: answer.addNewDepartment,
                },
                error => {
                    if (error) throw error;
                    console.log("Your new office Department has been added successfully");
                    viewDepartments();
                }
            );
        });
};

// function to add new title role
let addNewTitleRole = () => {
    inquirer
        .prompt([{
                name: "addNewTitleRole",
                type: "input",
                message: "Please type in a new Job Title/Role.",
                //validation function so the user will have to input a valid string for the name
                validate: response => {
                    if (response !== "") {
                        return true;
                    } else {
                        return "Please type in valid input characters.";
                    }
                },
            },
            {
                name: "addSalary",
                type: "input",
                message: "How much is the salary for this new Job Title/Role?",
                validate: response => {
                    //create variable to store response that should match with full numeric characters
                    const valid = response.match(/\d+$/)
                    if (valid) {
                        return true;
                    } else {
                        return "Please enter valid number values from 0-9.";
                    }
                },
            },
            {
                name: "addDepartmentId",
                type: "input",
                message: "Please type in a Department ID for the new Job Title/Role",
                validate: response => {
                    //create variable to store response that should match with full numeric characters
                    const valid = response.match(/\d+$/)
                    if (valid) {
                        return true;
                    } else {
                        return "Please enter valid number values from 0-9.";
                    }
                },
            },
        ])
        .then(answer => {
            console.log("Adding new Job Title/Role... \n");
            connection.query(
                "INSERT INTO employee_role SET ?", {
                    title_role: answer.addNewTitleRole,
                    salary: answer.addSalary,
                    department_id: answer.addDepartmentId,
                },
                error => {
                    if (error) throw error;
                    console.log("The new Job Title/Role has been added successfully");
                    viewRoles();
                });
        });
};

// function to add a new employee
const addNewEmployee = () => {
    inquirer
        .prompt([{
                name: "addFirstName",
                type: "input",
                message: "Please type in your new Employee's first name.",
                //validation function so the user will have to input a valid string for the name
                validate: response => {
                    if (response !== "") {
                        return true;
                    } else {
                        return "Please type in valid input characters.";
                    }
                },
            },
            {
                name: "addLastName",
                type: "input",
                message: "Please type in your new Employee's last name.",
                validate: response => {
                    //validation function so the user will have to input a valid string for the name
                    if (response !== "") {
                        return true;
                    } else {
                        return "Please type in valid input characters.";
                    }
                },
            },
            {
                name: "addRoleId",
                type: "input",
                message: "Please assign the appropriate title/role ID for your new Employee.",
                validate: response => {
                    //create variable to store response that should match with full numeric characters
                    const valid = response.match(/\d+$/)
                    if (valid) {
                        return true;
                    } else {
                        return "Please enter valid number values from 0-9.";
                    }
                },
            }
        ])
        .then((answer) => {
            console.log("Adding new Employee... \n");
            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: answer.addFirstName,
                    last_name: answer.addLastName,
                    role_id: answer.addRoleId
                },
                (error) => {
                    if (error) throw error;
                    console.log("A new Employee has been added successfully");
                    viewEmployees();
                }
            );
        });
};
// function to add a new manager
const addNewManager = () => {
    inquirer
        .prompt([{
                name: "addFirstName",
                type: "input",
                message: "Please type in your new Manager's first name.",
                //validation function so the user will have to input a valid string for the name
                validate: response => {
                    if (response !== "") {
                        return true;
                    } else {
                        return "Please type in valid input characters.";
                    }
                },
            },
            {
                name: "addLastName",
                type: "input",
                message: "Please type in your new Manager's last name.",
                validate: response => {
                    //validation function so the user will have to input a valid string for the name
                    if (response !== "") {
                        return true;
                    } else {
                        return "Please type in valid input characters.";
                    }
                },
            },
            {
                name: "addRoleId",
                type: "input",
                message: "Please assign the appropriate title/role ID for your new Manager.",
                validate: response => {
                    //create variable to store response that should match with full numeric characters
                    const valid = response.match(/\d+$/)
                    if (valid) {
                        return true;
                    } else {
                        return "Please enter valid number values from 0-9.";
                    }
                },
            },
            {
                name: "addManagerId",
                type: "input",
                message: "Please assign a new ID number for your new Manager",
                validate: response => {
                    //create variable to store response that should match with full numeric characters
                    const valid = response.match(/\d+$/)
                    if (valid) {
                        return true;
                    } else {
                        return "Please enter valid number values from 0-9.";
                    }
                },
            },
        ])
        .then(answer => {
            console.log("Adding new Manager... \n");
            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: answer.addFirstName,
                    last_name: answer.addLastName,
                    role_id: answer.addRoleId,
                    manager_id: answer.addManagerId,
                },
                error => {
                    if (error) throw error;
                    console.log("A new Manager has been added successfully.");
                    viewEmployees();
                }
            );
        });
};

// function for updating the role of an Employee
const updateRole = () => {
    // database query variable to pass in as a parameter for the connection query
    let query =
        "SELECT employee.id, first_name, last_name, role_id, manager_id, title_role, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    connection.query(query, (error, response) => {
        if (error) throw error;
        inquirer.prompt([{
                name: "chooseEmployee",
                type: "rawlist",
                message: "Please choose Employee whose role you would like to update?",
                choices: () => {
                    const nameArray = response.map(employee => employee.first_name);
                    return nameArray;
                }
            },
            {
                name: "chooseRole",
                type: "rawlist",
                message: "Please choose the new role of your Employee.",
                choices: () => {
                    const rolesArray = response.reduce((accumulator, role) => {
                        accumulator[role.title_role] = 1;
                        return accumulator;
                    }, {});
                    return (Object.keys(rolesArray));
                }
            }
        ]).then(answer => {
            let chosenRole;
            response.forEach(role => {
                if (role.title_role === answer.chooseRole) {
                    chosenRole = role;
                };
            });
            // updating the employee role and setting the new role id of the chosen employee
            connection.query("UPDATE employee SET ? WHERE ?", [{
                    role_id: chosenRole.id
                },
                {
                    first_name: answer.chooseEmployee
                },
            ], error => {
                if (error) throw error;
                console.log("Employee role updated successfuly.")
                viewEmployees();
            });
        });
    });
};
// ====================== END OF MVP ==================== //

// function for deleting employee
const deleteEmployee = () => {
    connection.query("SELECT * FROM employee", function(error, response) {
        if (error) throw error
        inquirer.prompt([{
            name: "chooseEmployee",
            type: "rawlist",
            message: "Please choose Employee you want to remove.",
            choices: () => {
                const nameArray = response.map(employee => employee.first_name);
                return nameArray;
            }
        }, ]).then(answer => {
            connection.query("DELETE FROM employee WHERE ?", {
                    first_name: answer.chooseEmployee
                },
                error => {
                    if (error) throw error
                    console.log("Employee deleted successfuly.")
                    viewEmployees();
                });
        });
    });
};

// function for deleting the roles, error: cannot delete a role with a child in it
let deleteRole = () => {
    connection.query("SELECT * FROM role", function(error, response) {
        if (error) throw error
        inquirer.prompt([{
            name: "chooseRole",
            type: "rawlist",
            message: "please choose which role you would like to update to?",
            choices: () => {
                const rolesArr = [];
                for (let i = 0; i < response.length; i++) {
                    rolesArr.push(response[i].title)

                }
                return rolesArr;
            }
        }, ]).then(answer => {
            connection.query("DELETE FROM role WHERE ?", {
                    title: answer.chooseRole
                },

                error => {
                    if (error) throw error
                    console.log("Tile/Role deleted successfuly.")
                    viewRoles();
                }
            )
        })
    })
};

// //for deleting the departments
// let deleteDepartment = () => {
//     connection.query("SELECT * FROM department", function(error, response) {
//         if (error) throw error
//         inquirer.prompt([{
//             name: "chooseDep",
//             type: "rawlist",
//             message: "please choose which role you would like to update to?",
//             choices: function() {
//                 const rolesArr = [];
//                 for (let i = 0; i < response.length; i++) {
//                     rolesArr.push(response[i].name)

//                 }
//                 return rolesArr;
//             }
//         }, ]).then(function(answer) {
//             connection.query("DELETE FROM department WHERE ?", {
//                     name: answer.chooseDep
//                 },

//                 function(error) {
//                     if (error) throw error
//                     viewDepartments()
//                 }

//             )
//         })
//     })
// }

// function to quit app but also added "Go Back" option in case the user did not mean to select quit
let quitApp = () => {
    inquirer.prompt({
        type: "list",
        name: "quit",
        message: "Are you sure you want to quit?",
        choices: ["Quit", "Go Back"]
    }).then((response) => {
        if (response.quit === "Quit") {
            connection.end();
        } else {
            init();
        }
    });
};