const inquirer = require('inquirer');
const { Pool } = require('pg');

// Assign Port
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

// Function to View all Departments   
const viewDepartments = async () => {
  try {
    const query = 'SELECT *  FROM department';
    const res = await pool.query(query);
    console.table(res.rows);
    promptUser();
  } catch (err) {
    console.error('Error Viewing Departments', err);
  }
};

// Function to View all Roles
const viewRoles = async() => {
  try{
    const query = 'SELECT * FROM role';
    const res = await pool.query(query);
    console.table(res.rows);
    promptUser();
  } catch (err) {
    console.error('Error Viewing Roles', err);
  }
};

// Function to View all Employees
const viewEmployees = async() => {
  try{
    const query = `SELECT e.id as "Employee Id", e.first_name as "First Name", e.last_name as "Last Name", r.title as "Title", d.name as "Department Name", r.salary as "Salary", CASE WHEN e.manager_id IS NULL THEN NULL ELSE CONCAT(m.first_name, ' ', m.last_name) END as "Manager Name" FROM employee as e JOIN role as r ON r.id = e.role_id JOIN department as d ON d.id = r.department_id LEFT JOIN employee as m ON e.manager_id = m.id`;
    const res = await pool.query(query);
    console.table(res.rows);
    promptUser();
  } catch (err) {
    console.error('Error viewing Employees', err.message);
  }
};

// Function to Add a Department
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

// Function to Add a Role
const addRole = async () => {
  try {

    const departmentsQuery = `SELECT d.id, d.name FROM department d`;
    const departmentsResult = await pool.query(departmentsQuery);
    const departments = departmentsResult.rows;

    const departmentChoices = departments.map(department => ({
      name: `${department.name}`,
      value: department.id
    }))

    const { title, salary, department_id } = await inquirer.prompt([
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
        type: 'list',
        name: 'department_id',
        message: 'What is the name of the department?',
        choices: departmentChoices,
      },
    ]);

    const selectedDepartment = departments.find(department => department.id === department_id);

    const maxIdQuery = 'SELECT MAX(id) as max_id FROM role';
    const maxIdResult = await pool.query(maxIdQuery);
    const nextId = (maxIdResult.rows[0].max_id || 0) + 1;

    const query = 'INSERT INTO role (id, title, salary, department_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const res = await pool.query(query, [nextId, title, salary, department_id]);
    console.log(`Added ${title} to the ${selectedDepartment.name} department in the database`);
    promptUser();
  } catch (err) {
    console.error('Error adding Role', err);
  }
};

// Function to Add an Employee
const addEmployee = async () => {
  try {

    const rolesQuery = `SELECT r.id, r.title FROM role r`;
    const rolesResult = await pool.query(rolesQuery);
    const roles = rolesResult.rows;

    const rolesChoices = roles.map(role => ({
      name: `${role.title}`,
      value: role.id
    }))

    const managersQuery = `SELECT e.id, e.first_name, e.last_name FROM employee e`;
    const managersResult = await pool.query(managersQuery);
    const managers = managersResult.rows;

    const managersChoices = managers.map(manager => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id
    }));

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
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
        type: 'list',
        name: 'role_id',
        message: `What is the employee's role?`,
        choices: rolesChoices,
      },
      {
        type: 'list',
        name: 'manager_id',
        message: `Who is the employee's manager?`,
        choices: managersChoices,
      },
    ]);

    const selectedRole = roles.find(role => role.id === role_id);
    const selectedManager = managers.find(manager => manager.id === manager_id);

    //find the highest employee id and create the new employee with the the id+1
    const maxIdQuery = 'SELECT MAX(id) as max_id FROM employee';
    const maxIdResult = await pool.query(maxIdQuery);
    const nextId = (maxIdResult.rows[0].max_id || 0) + 1;

    const query = 'INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const res = await pool.query(query, [nextId, first_name, last_name, role_id, manager_id]);
    console.log(`Added ${first_name} ${last_name} with the role of ${selectedRole.title} reporting to ${selectedManager.first_name} ${selectedManager.last_name} to the database`)
    promptUser();
  } catch (err) {
    console.error('Error adding Employee', err.message);
  }
};

// Function to Update an Employee's Role
const updateEmployeeRole = async() => {
  try {

    const employeesQuery = `SELECT e.id, e.first_name, e.last_name FROM employee e`;
    const employeesResult = await pool.query(employeesQuery);
    const employees = employeesResult.rows;

    const employeesChoices = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }));

    const rolesQuery = `SELECT r.id, r.title FROM role r`;
    const rolesResult = await pool.query(rolesQuery);
    const roles = rolesResult.rows;

    const rolesChoices = roles.map(role => ({
      name: `${role.title}`,
      value: role.id
    }))

    const { employee_id, role_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: `What employee would you like to their role?`,
        choices: employeesChoices,
      },
      {
        type: 'list',
        name: 'role_id',
        message: `What role would you like to update them to?`,
        choices: rolesChoices,
      },
    ]);

    const selectedEmployee = employees.find(employee => employee.id === employee_id);
    const selectedRole = roles.find(role => role.id === role_id);

    const query = `UPDATE employee SET role_id = $2 WHERE id = $1`;
    const res = await pool.query(query, [employee_id, role_id]);
    console.log(`${selectedEmployee.first_name} ${selectedEmployee.last_name} updated to role ${selectedRole.title}`);
    promptUser();
  } catch (err) {
    console.error('Error updating employee' ,err.message);
  };
};

// Function to Prompt User for Employee Tracker questions
const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Employees', 'View All Roles', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'],
    },
  ]).then((answers) => {
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

// Invoke function
promptUser();