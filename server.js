const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./config/connection');
const cTable = require('console.table');
const Table = require('ascii-art-table');

// Define arrays to hold departments and managers
let depArray = [];
let manArray = [];

// Establish connection and initiate the app
connection.connect((err) => {
    if(err) throw err;
    init();
});

// Connection queries to populate arrays to hold current departments and managers
connection.query('SELECT * FROM department', (err, res) => {
    res.forEach(({name}) => {
        depArray.push(name);
    })
    console.log(depArray);
});

// Managers will always have a NULL manager_id
connection.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', (err, res) => {
    res.forEach(({first_name, last_name}) => {
        manArray.push(first_name + ' ' + last_name);
    })
    console.log(manArray);
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

    const query = 'SELECT * from employee';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res)
        init();
    })
};

const viewEmpByDep = () => {
    // inquirer
    // .prompt({ name: 'department', 'type')

};

const viewEmpByMan = () => {

};

const addEmployee = () => {

};

const removeEmployee = () => {

};

const updateEmpRole = () => {

};

const updateEmpMan = () => {

};

const viewRoles = () => {

    const query = 'SELECT * from role';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res)
        init();
    })
};

const addRole = () => {

};

const removeRole = () => {

};

const viewDepartments = () => {

    const query = 'SELECT * from department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res)
        init();
    })
    

};

const addDepartment = () => {

};

const removeDepartment = () => {

};

const viewBudget = () => {

};
