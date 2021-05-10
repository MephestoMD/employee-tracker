const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./config/connection');
const cTable = require('console.table');
const figlet = require('figlet');

// Define arrays to hold available prompt choices for departments, managers, roles and employees
let depArray = [];
let manArray = [];
let roleArray = [];
let empArray = [];

figlet.text('EMPLOYEE TRACKER', {
    font: 'Big Money-nw',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 150,
    whitespaceBreak: true
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(`\n\n`)
    console.log(data);
    console.log(`--- An employee management system brought to you by MephestoMD ---`)
    console.log(`\n\n`)
});

// Establish connection
connection.connect((err) => {
    if(err) throw err; 
    setTimeout(init, 250);
});


// Defining the inquirer prompt question choices for the main menu
const initQs = { name: 'selection', type: 'list', message: 'Choose an available option from the following list: ',
choices: [
    'View all employees',
    'View all employees by department',
    'View all employees by manager',
    'Add employee',
    'Remove employee',
    'Update employee role',
    'Update employee manager',
    'View all roles',
    'Add role',
    'Remove role',
    'View all departments',
    'Add department',
    'Remove department',
    'View budget by department',
    'Exit'
]}

// Function definition for the initial main menu function and choice routing
const init = () => {

    // Connection queries to populate arrays to hold current departments, managers, role titles and employees
connection.query('SELECT * FROM department', (err, res) => {
    res.forEach(({name}, index) => {
        depArray[index] = name;
    })
});

// Managers will always have a NULL manager_id
connection.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', (err, res) => {
    res.forEach(({first_name, last_name}, index) => {
        manArray[index] = (first_name + ' ' + last_name);
    })
});

connection.query('SELECT * FROM role', (err, res) => {
    res.forEach(({title}, index) => {
        roleArray[index] = title;
    })
});

connection.query('SELECT first_name, last_name FROM employee', (err, res) => {
    res.forEach(({first_name, last_name}, index) => {
        empArray[index] = (first_name + ' ' + last_name);
    })
});

// Main menu prompt
    inquirer
        .prompt (initQs)
        .then((data) => {
            switch (data.selection) {
                case 'View all employees':
                    viewEmployees();
                    break;

                case 'View all employees by department':
                    viewEmpByDep();
                    break;

                case 'View all employees by manager':
                    viewEmpByMan();
                    break;

                case 'Add employee':
                    addEmployee();
                    break;

                case 'Remove employee':
                    removeEmployee();
                    break;

                case 'Update employee role':
                    updateEmpRole();
                    break;
                    
                case 'Update employee manager':
                    updateEmpMan();
                    break;

                case 'View all roles':
                    viewRoles();
                    break;

                case 'Add role':
                    addRole();
                    break;

                case 'Remove role':
                    removeRole();
                    break;

                case 'View all departments':
                    viewDepartments();
                    break;

                case 'Add department':
                    addDepartment ();
                    break;                  
                    
                case 'Remove department':
                    removeDepartment();
                    break;

                case 'View budget by department':
                    viewBudget();
                    break;

                case 'Exit':
                    connection.end();
                    break;

                default:
                    throw Error;
            }
        });

};

// Function to display all current employees
const viewEmployees = () => {

    const query = `SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Role", d.name AS "Department",
    r.salary AS "Salary", CONCAT(m.first_name, " ", m.last_name) AS "Manager" FROM employee e
    JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on m.id = e.manager_id ORDER BY e.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table("-- All current Employees: --", res)
        init();
    })
};

// View employees by Department
const viewEmpByDep = () => {
    inquirer
    .prompt({ name: 'department', type: 'list', message: 'For which department would you like a list of employees?', choices: depArray})
    .then((data) => {   
        const query = `SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", r.salary AS "Salary" FROM employee e 
        JOIN role r ON r.id = e.role_id JOIN department d ON r.department_id = d.id WHERE d.name = ? ORDER BY e.id;`;
        connection.query(query, [data.department], (err, res) => {
            if (err) throw err;
            console.table(`-- Current employees of ${data.department}: --`, res)
            init();
    })
})
};

// View employees by Manager
const viewEmpByMan = () => {
    inquirer
    .prompt({ name: 'manager', type: 'list', message: 'For which manager would you like a list of employees?', choices: manArray})
    .then((data) => {   
        const query = `SELECT e.id AS "Employee ID", e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", r.salary AS "Salary" FROM employee e 
        JOIN role r ON r.id = e.role_id JOIN department d ON r.department_id = d.id JOIN employee m ON m.id = e.manager_id WHERE CONCAT(m.first_name," ",m.last_name) = ? ORDER BY e.id;`;
        connection.query(query, [data.manager], (err, res) => {
            if (err) throw err;
            console.table(`-- Employees under the management of ${data.manager}: --`, res)
            init();
    });
})
};

// Add an Employee
const addEmployee = () => {
    inquirer
    .prompt(
        [{name: 'first_name', type: 'input', message: 'What is the first name of the employee?'},
        {name: 'last_name', type: 'input', message: 'What is the last name of the employee?'},
        {name: 'role', type: 'list', message: 'What is the title of their role?', choices: roleArray},
        {name: 'manager', type: 'list', message: 'Who is their manager?', choices: manArray}]
        )
    .then((data) => {
        const query = `INSERT INTO employee(first_name, last_name, manager_id, role_id)
        VALUES(?, ?, 
        (SELECT * FROM (SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?) AS managerID),
        (SELECT id FROM role WHERE role.title = ?)
        )` 
        connection.query(query, [data.first_name, data.last_name, data.manager, data.role], (err, res) => {
            if (err) throw err;
            console.table(`-- Employee, ${data.first_name} ${data.last_name} has been added --`)
            init();
        }
        )
    })
};

// Remove an Employee
const removeEmployee = () => {
    inquirer
    .prompt({name: 'employee', type: 'list', message: 'Which employee would you like to remove?', choices: empArray})
    .then((data) => {
        const query = `DELETE FROM employee WHERE CONCAT(employee.first_name," ",employee.last_name) = ?`
        connection.query(query, [data.employee], (err, res) => {
            if (err) throw err;
            console.table(`-- Employee, ${data.employee}, has been removed! --`)
            init(); 
        })
    });
};

// Update an Employee's Role
const updateEmpRole = () => {
    inquirer
    .prompt({name: 'employee', type: 'list', message: 'Which employee\'s role would you like to update?', choices: empArray})
    .then((emp) =>
    inquirer
    .prompt({name: 'role', type: 'list', message: `What is ${emp.employee}\'s new role?`, choices: roleArray})
    .then((role) => {
        const query = `UPDATE employee SET role_id = (SELECT id FROM role WHERE role.title = ?) WHERE CONCAT(employee.first_name," ",employee.last_name) = ?`
        connection.query(query, [role.role,emp.employee], (err, res) => {
            if (err) throw err;
            console.table(`-- ${emp.employee}\'s role updated to ${role.role} --`);
            init();
        })
    }))
};

// Update an Employee's Manager
const updateEmpMan = () => {
    inquirer
    .prompt({name: 'employee', type: 'list', message: 'Which employee\'s manager would you like to update?', choices: empArray})
    .then((emp) =>
    inquirer
    .prompt({name: 'manager', type: 'list', message: `Who is ${emp.employee}\'s new manager?`, choices: manArray})
    .then((man) => {
        const query = `UPDATE employee SET manager_id = (SELECT id FROM (SELECT id FROM employee m WHERE CONCAT(m.first_name," ",m.last_name) = ?) AS m) WHERE CONCAT(employee.first_name," ",employee.last_name) = ?`
        connection.query(query, [man.manager,emp.employee], (err, res) => {
            if (err) throw err;
            console.table(`-- ${emp.employee}\'s manager is now ${man.manager} --`);
            init();
        })
    }))
};

// View all roles
const viewRoles = () => {

    const query = `SELECT r.id AS "Role ID", r.title AS "Title", r.salary AS "Salary", d.name AS "Department" FROM role r JOIN department d ON d.id = r.department_id ORDER BY r.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(`-- Viewing all current roles within the company: --`, res)
        init();
    })
};

// Add a Role
const addRole = () => {
    inquirer
    .prompt(
        [{name: 'title', type: 'input', message: 'What is the title of the role you would like to add?'},
        {name: 'salary', type: 'input', message: 'What is the salary for this role? (Enter number without dollar symbol or commas)'},
        {name: 'department', type: 'list', message: 'In what department is this role?', choices: depArray},
    ])
    .then((data) => {
        const query = `INSERT INTO role(title,salary,department_id) 
        VALUES(?,?, (SELECT id FROM department WHERE department.name = ?))`;
        connection.query(query,[data.title,data.salary,data.department], (err, res) => {
            if (err) throw err;
            console.table(`-- Added role, ${data.title} --`);
            init();
        })
    })
};

// Remove a Role
const removeRole = () => {
    inquirer
    .prompt({name: 'role', type: 'list', message: 'Which role would you like to remove?', choices: roleArray})
    .then((data) => {
        const query = `DELETE FROM role WHERE role.title = ?`;
        connection.query(query,[data.role], (err, res) => {
            if (err) throw err;
            console.table(`-- ${data.role} removed from available roles --`);
            init();
        });
    });
};

// View all Departments
const viewDepartments = () => {
    const query = 'SELECT d.id AS "Department ID", d.name AS "Name" FROM department d ORDER BY d.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(`-- Viewing all current departments within the company: `, res)
        init();
    })
};

// Add a Department
const addDepartment = () => {
    inquirer.prompt({name: 'department', type: 'input', message: 'What is the name of the department you would like to add?'})
    .then((data) => {
        const query = `INSERT INTO department(name)
        VALUES (?)`;
        connection.query(query,[data.department], (err, res) => {
            if (err) throw err;
            console.table(`-- ${data.department} added to departments --`);
            init();
        });
    });
};

// Remove a Department
const removeDepartment = () => {
    inquirer
    .prompt({name: 'department', type: 'list', message: 'Which department would you like to remove?', choices: depArray})
    .then((data) => {
        const query = `DELETE FROM department WHERE department.name = ?`;
        connection.query(query, [data.department], (err, res) => {
            if (err) throw err;
            console.table(`-- ${data.department} has been removed from available departments --`);
            init();
        })
    });
};


const viewBudget = () => {
    inquirer.prompt({name: 'department', type: 'list', message: 'For which department you would like to view the total salary budget?', choices: depArray})
    .then((data) => {
        const query = `SELECT SUM(r.salary) AS "Total Budget" FROM role r WHERE r.department_id = (SELECT id FROM department WHERE department.name = ?)`;
        connection.query(query, [data.department], (err, res) => {
            if (err) throw err;
            console.table(`The total salary budget for ${data.department} is: `, res);
            init();
        });
    });
};