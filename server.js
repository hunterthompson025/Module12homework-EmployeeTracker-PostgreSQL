const inquirer = require('inquirer');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;

// Connect to database
const pool = new Pool(
  {
    user: 'postgres',
    password: '1',
    host: 'localhost',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

pool.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch(err => console.error('Error connecting to the database:', err));

const viewDepartments = async () => {
  try {
    const query = 'SELECT *  FROM department';
    const res = await pool.query(query);
    console.log('View All Departments selected. Departments:', res.rows);
    promptUser();
  } catch (err) {
    console.error('Error Viewing Departments', err);
  }
};

const viewEmployees = () => {

};

const addDepartment = async () => {
  try {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the department?',
      },
    ]);

    const maxIdQuery = 'SELECT MAX(id) AS max_id FROM department';
    const maxIdResult = await pool.query(maxIdQuery);
    const nextId = (maxIdResult.rows[0].max_id || 0) + 1;

    const query = `INSERT INTO department (id, name) VALUES ($1, $2) RETURNING *`;
    const res = await pool.query(query, [nextId, name]);
    console.log(`Added ${name} to the database`);
    promptUser();
  } catch (err) {
    console.error('Error Adding Department', err);
  }
};


const addRole = async () => {
  try {
    const { title, salary, department_name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for the role?'
      },
      {
        type: 'input',
        name: 'department_name',
        message: 'What is the name of the department?'
      },
    ]);

    console.log(`Department name entered: ${department_name}`);

    const departmentQuery = 'SELECT id FROM department WHERE name = $1';
    const departmentResult = await pool.query(departmentQuery, [department_name]);

    console.log('Department query result:', departmentResult);

    const departmentId = departmentResult.rows[0].id;
    console.log(`Department ID for ${department_name} is ${departmentId}`);

    console.log(departmentId);
    
    if (!departmentId) {
      console.log(departmentId);
      console.error('Department does not exist. Please try again.');
      return;
    }

    const maxIdQuery = 'SELECT MAX(id) as max_id FROM role';
    console.log('max query', maxIdQuery);
    const maxIdResult = await pool.query(maxIdQuery);
    console.log('max id',maxIdResult);
    const nextId = (maxIdResult.rows[0].max_id || 0) + 1;
    console.log('next id',nextId);
    const query = 'INSERT INTO role (id, title, salary, department_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const res = await pool.query(query, [nextId, title, salary, departmentId]);
    console.log(`Added ${title} to the ${department_name} department in the database`);
    promptUser();
  } catch (err) {
    console.error('Error adding Role', err);
  }
};

const addEmployee = () => {

};

const updateEmployeeRole = () => {

};

const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'],
    },
  ]).then((answers) => {
    console.log('User selected:', answers.prompt);
    switch (answers.prompt) {
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Emplyoee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      default:
        console.log('Please choose an option.');
    }
  }).catch((error) => {
    console.error('Error during prompt:', error)
  });
};

promptUser();