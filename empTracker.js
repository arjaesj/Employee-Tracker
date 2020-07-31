const mysql = require("mysql");
const inquirer = require("inquirer");
require('dotenv').config()

// Create the connection to the mysql db with the following credentials. Used dotenv pakage to hide credentials.
const connection = mysql.createConnection({
    // Assign Port to 3306
    port: 3306,
    host: "localhost",

    // Your username
    user: "root",

    // Your password saved in process.env
    password: process.env.PASSWORD,

    database: "employeeTracker_db"

});

// Initiate MySQL Connection.
connection.connect(function (error) {
    if (error) {
        console.error("error connecting: " + error.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    init();
});

function init() {
    inquirer
        .prompt({
            name: "selections",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Departments",
                "View All Employee Roles",
                "Add Departments",
                "Add Employee Role",
                "Add Employees",
                "Update Employee Role",
                "Delete Employee",
                "Delete Employee Role",
                "Delete Departments",
                "Quit"
            ],
        })
        .then(({ selections }) => {
            switch (selections) {
                case "View All Employees":
                    viewEmployee();
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "View All Employee Roles":
                    viewRoles();
                    break;
                case "Add Departments":
                    addDepartment();
                    break;
                case "Add Employee Role":
                    addRole();
                    break;
                case "Add Employees":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Delete departments":
                    deleteDep();
                    break; case "Delete Employee Role":
                    deleteRole();
                    break;
                case "Delete Employee":
                    deleteEmployee();
                    break;
                case "Quit":
                    quitApp();
                    break;

            }
        });
}

// viewing departments
let viewDepartments = () => {
    console.log("selecting employees \n");
    connection.query("SELECT * FROM department", function (error, response) {
        if (error) throw error;
        console.table(response);
        // calling init in each one of these view funciton to make sure that we dont run into any async problems when pulling inquirer back up
        init();
    });
};

let viewRoles = () => {
    console.log("selecting employees \n");
    connection.query("SELECT * FROM employee_role", function (error, response) {
        if (error) throw error;
        console.table(response);
        init();
    });
};

// viewing employees 
let viewEmployee = () => {
    // empty array for displaying the joined tables
    let allArr = [];
    // joining the tables for the information i want displayed abd setting it to query
    let query =
        "SELECT employee.id, first_name, last_name, role_id, manager_id, title, salary, name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";
    connection.query(query, function (error, response) {
        if (error) throw error;

        let employeeArr = [];

        // creating a loop through the criteria and pushin to the table
        for (var i = 0; i < response.length; i++) {
            employeeArr = [];

            employeeArr.push(response[i].id);
            employeeArr.push(response[i].first_name);
            employeeArr.push(response[i].last_name);
            employeeArr.push(response[i].title);
            employeeArr.push(response[i].salary);
            employeeArr.push(response[i].name);

            allArr.push(employeeArr);
        }

        console.log("\n \n");
        console.table(response);

        init();
    });
};

// adding a department
let addDepartment = () => {
    inquirer
        .prompt([
            {
                name: "addDepartment",
                type: "input",
                message: "Type in the Department name you want to add.",
                validate: (response) => {
                    if (response !== "") {
                        //entered in validaiton so the return msut be a string
                        return true;
                    } else {
                        return "Please type in valid input characters.";
                    }
                },
            },
        ])
        .then(function (answer) {
            console.log("Adding department... \n");
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.addDepartment,

                },
                function (error) {
                    if (error) throw error;
                    console.log("Your new Department name has been added successfully");
                    viewDepartments();

                }
            );
        });
};

// adding a new role
let addRole = () => {
    inquirer
        .prompt([
            {
                name: "addRole",
                type: "input",
                message: "Please type in a new Job Role/Title.",
                validate: (response) => {
                    if (response !== "") {
                        //entered in validaiton so the return msut be a string
                        return true;
                    } else {
                        return "Please type in valid input characters.";
                    }
                },
            },
            {
                name: "addsalary",
                type: "input",
                message: "How much is the salary for this title/role?",
                validate: (response) => {
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
                name: "addid",
                type: "input",
                message: "Please type in a Department ID",
                validate: (response) => {
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
        .then(function (answer) {
            console.log("Adding new role... \n");
            connection.query(
                "INSERT INTO employee_role SET ?",
                {
                    title: answer.addtitle,
                    salary: answer.addsalary,
                    department_id: answer.addid,
                },
                function (error) {
                    if (error) throw error;
                    console.log("The new Department has been added successfully");
                    viewRoles();
                }
            );
        });
};

//funcitonality for adding employee
let addEmployee = () => {
    inquirer
        .prompt([
            {
                name: "addfirstname",
                type: "input",
                message: "Please type in your new employee's first name.",
                validate: (response) => {
                    if (response !== "") {
                        //entered in validaiton so the return msut be a string
                        return true;
                    } else {
                        return "Please type in valid input characters.";
                    }
                },
            },
            {
                name: "addlastname",
                type: "input",
                message: "Please type in your new employee's last name.",
                validate: (response) => {
                    if (response !== "") {
                        //entered in validaiton so the return msut be a string
                        return true;
                    } else {
                        return "Please type in valid input characters.";
                    }
                },
            },
            {
                name: "addroleid",
                type: "input",
                message: "Please assign the corresponding ID for your new Employee's title/role.",
                validate: (response) => {
                    //create variable to store response that should match with full numeric characters
                    const valid = response.match(/\d+$/)
                    if (valid) {
                        return true;
                    } else {
                        return "lease enter valid number values from 0-9.";
                    }
                },
            },
            {
                name: "addmanagerid",
                type: "input",
                message: "Please add in a manager ID",
                validate: (response) => {
                    const valid = response.match(/^[1-9]\d*$/ || null); // this syntax for the match took a while to reasearch/ get right
                    if (valid) {
                        return true;
                    } else {
                        return "You must enter a number between 1-10";
                    }
                },
            },
        ])
        .then(function (answer) {
            console.log("adding new Employee \n");
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.addfirst,
                    last_name: answer.addlast,
                    role_id: answer.addroleid,
                    manager_id: answer.addmanagerid,
                },
                function (error) {
                    if (error) throw error;
                    console.log("A new employee has been added successfully");
                    viewEmployee();
                }
            );
        });
};

// for updating the role of a chosen employee
let updateRole = () => {
    connection.query(
        "SELECT employee.id, first_name, last_name, role_id, manager_id, title, salary, name FROM employee JOIN role ON (employee.role_id = role.id) JOIN department ON (department.id = role.department_id)",
        function (error, response) {
            if (error) throw error;
            inquirer.prompt([
                {
                    name: "chooseName",
                    type: "rawlist",
                    message: "please choose whose role you would like to update?",
                    choices: function () {
                        const nameArray = [];
                        for (let i = 0; i < response.length; i++) {
                            nameArray.push(response[i].first_name)

                        }
                        return nameArray;
                    }
                },
                {
                    name: "chooseRole",
                    type: "rawlist",
                    message: "please choose which role you would like to update to?",
                    choices: function () {
                        const rolesArr = [];
                        for (let i = 0; i < response.length; i++) {
                            rolesArr.push(response[i].title)

                        }
                        return rolesArr;
                    }
                }

            ]).then(function (answer) {
                // making sure we arent copying over every employee's role
                let chosenRole;
                for (let i = 0; i < response.length; i++) {
                    if (response[i].title === answer.chooseRole) {
                        chosenRole = response[i];
                    }
                }
                // updating the employee and setting the chosen id  on the first name chosen
                connection.query("UPDATE employee SET ? WHERE ?",
                    [
                        {
                            role_id: chosenRole.id
                        },
                        {
                            first_name: answer.chooseName
                        },

                    ],
                    function (error) {
                        if (error) throw error
                        viewEmployee();
                    }
                )
            })
        });
};

//for deleting the departments
let deleteDep = () => {
    connection.query("SELECT * FROM department", function (error, response) {
        if (error) throw error
        inquirer.prompt([
            {
                name: "chooseDep",
                type: "rawlist",
                message: "please choose which role you would like to update to?",
                choices: function () {
                    const rolesArr = [];
                    for (let i = 0; i < response.length; i++) {
                        rolesArr.push(response[i].name)

                    }
                    return rolesArr;
                }
            },
        ]).then(function (answer) {
            connection.query("DELETE FROM department WHERE ?",
                {
                    name: answer.chooseDep
                },

                function (error) {
                    if (error) throw error
                    viewDepartments()
                }

            )
        })
    })
}

// for deleting the roles, cannot delete a role with a child in it
let deleteRole = () => {
    connection.query("SELECT * FROM role", function (error, response) {
        if (error) throw error
        inquirer.prompt([
            {
                name: "chooseRole",
                type: "rawlist",
                message: "please choose which role you would like to update to?",
                choices: function () {
                    const rolesArr = [];
                    for (let i = 0; i < response.length; i++) {
                        rolesArr.push(response[i].title)

                    }
                    return rolesArr;
                }
            },
        ]).then(function (answer) {
            connection.query("DELETE FROM role WHERE ?",
                {
                    title: answer.chooseRole
                },

                function (error) {
                    if (error) throw error
                    viewRoles();
                }

            )
        })
    })
}
// deleting employee
let deleteEmployee = () => {
    connection.query("SELECT * FROM employee", function (error, response) {
        if (error) throw error
        inquirer.prompt([
            {
                name: "chooseEmp",
                type: "rawlist",
                message: "please choose which role you would like to update to?",
                choices: function () {
                    const rolesArr = [];
                    for (let i = 0; i < response.length; i++) {
                        rolesArr.push(response[i].first_name)

                    }
                    return rolesArr;
                }
            },
        ]).then(function (answer) {
            connection.query("DELETE FROM employee WHERE ?",
                {
                    first_name: answer.chooseEmp
                },

                function (error) {
                    if (error) throw error
                    viewEmployee();
                }

            )
        })
    })
}
// quitting app to hold a  connection.end also added in a go back incase a user did not mean to click quit
let quitApp = () => {
    inquirer.prompt({
        type: "list",
        name: "quit",
        message: "Are you sure you want to quit?",
        choices: ["Quit", "Go Back"]
    }).then(function (response) {
        if (response.quit === "Quit") {
            connection.end();
        } else {
            init();
        }
    })
}

