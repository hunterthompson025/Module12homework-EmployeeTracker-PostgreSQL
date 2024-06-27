INSERT INTO department (id, name)
VALUES
(1, 'Development'),
(2, 'Quality Assurance'),
(3, 'Customer Service');

INSERT INTO role (id, title, salary, department_id)
VALUES
(1, 'Developer', 100000, 1),
(2, 'Development Manager', 250000, 1),
(3, 'Analyst', 50000, 2),
(4, 'QA Manager', 100000, 2),
(5, 'Representative', 45000, 3),
(6, 'CS Manager', 95000, 3);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Luke', 'Lockard', 1, 2),
(2, 'Garrett', 'Blythe', 2, null),
(3, 'Kenny', 'Davis', 3, 4),
(4, 'Stephanie', 'Harrigan', 4, null),
(5, 'Brycen', 'Head', 5, 6),
(6, 'Pam', 'Moore', 6, null);
