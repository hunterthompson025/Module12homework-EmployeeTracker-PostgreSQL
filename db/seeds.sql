INSERT INTO department (id, name)
VALUES
(1, 'Development'),
(2, 'Quality Assurance'),
(3, 'Customer Service');

INSERT INTO role (id, title, salary, department_id)
VALUES
(1, 'Developer', 100,000, 1),
(2, 'Sr Developer', 150,000, 1),
(3, 'Lead Developer', 200,000, 1),
(4, 'Development Manager', 250,000, 1)
(5, 'Analyst', 50,000, 2),
(6, 'Sr Analyst', 65,000, 2),
(7 'Lead Analyst', 75,000, 2),
(8, 'QA Manager', 100,000, 2),
(9, 'Representative', 45,000, 3),
(10, 'Sr Representative', 55,000, 3),
(11, 'Lead Representative', 70,000, 3),
(12, 'CS Manager', 95,000, 3);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Luke', 'Lockard', 1, 4),
(2, 'Jake', 'Roy', 2, 4),
(3, 'Rylee', 'Contois', 3, 4),
(4, 'Garrett', 'Blythe', 4, null),
(5, 'Kenny', 'Davis', 5, 8),
(6, 'Mike', 'Sexton', 6, 8),
(7, 'Hunter', 'Thompson', 7, 8)
(8, 'Stephanie', 'Harrigan', 8, null),
(9 'Brycen', 'Head', 9, 12),
(10, 'Michael', 'Brandt', 10, 12),
(11, 'Elisa', 'Moraga', 11, 12),
(12, 'Pam', 'Moore', 12, null);
