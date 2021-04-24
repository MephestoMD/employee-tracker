const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./config/connection');

connection.connect((err) => {
    if(err) throw err;
    init();
});

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

const viewEmployees = () => {
    const query = 'SELECT '
};

const viewEmpByDep = () => {

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

};

const addRole = () => {

};

const removeRole = () => {

};

const viewDepartments = () => {

};

const addDepartment = () => {

};

const removeDepartment = () => {

};

const viewBudget = () => {

};
