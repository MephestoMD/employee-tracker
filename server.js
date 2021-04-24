const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',  
    port: 3306,
    user: 'root',
    password: 'W@tbh03890389',
    database: 'office_DB',
  });

  connection.connect((err) => {
      if(err) throw err;
      console.log(err);
      init();
  })

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
                    break; 

                default:
                    throw Error;
            }
        });

  }

