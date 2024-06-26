-- View All Departments
SELECT *
FROM department;

-- View All Employees (idea as to what I need to do for the table display in the app for viewing employees)
SELECT id, first_name, last_name, r.title, r.salary, concat manager(first_name + last_name);
FROM employee;

--View All Roles
SELECT * 
FROM role


-- Add Department
INSERT INTO department (id, name)
VALUES
(4, 'IT');

-- Add Role
INSERT INTO role (id, title, salary, department_id)
VALUES
(13, 'Admin', 65000, 4);

-- Add Employee
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(13, 'Hayden', 'Bigelow', 13, null);

-- Update Employee Role
UPDATE role
SET title = 'JR Analyst'
WHERE id = 5;