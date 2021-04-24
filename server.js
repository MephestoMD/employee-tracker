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

  const initQs = { name: 'action', type: 'list', message: 'Choose an available option from the following list: ',
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
        .prompt (initQs);
  }

