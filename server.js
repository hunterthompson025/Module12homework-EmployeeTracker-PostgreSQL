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
    console.log('View All Departments');
    console.table(res.rows);
    promptUser();
  } catch (err) {
    console.error('Error Viewing Departments', err);
  }
};

const viewRoles = async() => {
  try{
    const query = 'SELECT * FROM role';
    const res = await pool.query(query);
    console.log('View all Roles');
    console.table(res.rows);
    promptUser();
  } catch (err) {
    console.error('Error Viewing Roles', err);
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
    console.error('Error adding Department', err);
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
    console.log('max id', maxIdResult);
    const nextId = (maxIdResult.rows[0].max_id || 0) + 1;
    console.log('next id', nextId);
    const query = 'INSERT INTO role (id, title, salary, department_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const res = await pool.query(query, [nextId, title, salary, departmentId]);
    console.log(`Added ${title} to the ${department_name} department in the database`);
    promptUser();
  } catch (err) {
    console.error('Error adding Role', err);
  }
};

const addEmployee = async () => {
  try {
    const { first_name, last_name, role_title, manager_name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: `What is the employee's first name?`,
      },
      {
        type: 'input',
        name: 'last_name',
        message: `What is the employee's last name?`,
      },
      {
        type: 'input',
        name: 'role_title',
        message: `What is the employee's role?`,
      },
      {
        type: 'input',
        name: 'manager_name',
        message: `Who is the employee's manager?`,
      },
    ]);

    const roleQuery = 'SELECT id FROM role WHERE title = $1';
    const roleResult = await pool.query(roleQuery, [role_title]);

    console.log('Role query result:', roleResult);

    const roleId = roleResult.rows[0].id;
    console.log(`Role ID for ${role_title} is ${roleId}`);

    console.log('role id', roleId);

    if (!roleId) {
      console.log(roleId);
      console.error('Role does not exist. Please try again');
      return;
    }

    const [manager_first_name, manager_last_name] = manager_name.split(' ');
    console.log('manager_first_name', manager_first_name);
    console.log('manager_last_name', manager_last_name);

    if (!manager_first_name || !manager_last_name) {
      console.error('Invalid Manager Name');
      return;
    }

    const managerQuery = 'SELECT id FROM employee WHERE first_name = $1 AND last_name = $2';
    const managerResult = await pool.query(managerQuery, [manager_first_name, manager_last_name]);

    console.log('managerResult', managerResult);

    const managerId = managerResult.rows[0]?.id;

    console.log('managerId', managerId);


    if (!managerId) {
      console.error('Invalid Manager Name. Please try again');
      return;
    }

    //find the highest employee id and create the new employee with the the id+1
    const maxIdQuery = 'SELECT MAX(id) as max_id FROM employee';
    console.log('max query', maxIdQuery);
    const maxIdResult = await pool.query(maxIdQuery);
    console.log('max id', maxIdResult);
    const nextId = (maxIdResult.rows[0].max_id || 0) + 1;
    console.log('next id', nextId);

    const query = 'INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const res = await pool.query(query, [nextId, first_name, last_name, roleId, managerId]);
    console.log(`Added ${first_name} ${last_name} to the database`)
    promptUser();
  } catch (err) {
    console.error('Error adding Employee', err.message);
  }
};

const updateEmployeeRole = () => {

};

const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Employees', 'View All Roles', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'],
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
      case 'View All Roles':
        viewRoles();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
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