USE office_DB;

INSERT INTO department (name)
VALUES 
('Human Resource Management'),
('Research and Development'),
('Accounting');

INSERT INTO role (title, salary, department_id)
VALUES 
('HR Manager', 67500, 1),               /* 1 */
('Junior Representative', 45000, 1),    /* 2 */
('Senior Representative', 52500, 1),    /* 3 */
('R&D Manager', 125750, 2),             /* 4 */
('Associate Researcher', 58000, 2),     /* 5 */
('Senior Researcher', 82500, 2),        /* 6 */
('Accounting Manager', 95500, 3),       /* 7 */
('Junior Accountant', 52000, 3),        /* 8 */
('Senior Accountant', 77500, 3);        /* 9 */

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Bob', 'Denver', 1, null),
('Kris', 'Kristopherson', 2, 1),
('Judi', 'Dench', 3, 1),
('Stephen', 'Hawking', 4, null),
('Jane', 'Goodall', 5, 4),
('Isaac', 'Newton', 6, 4),
('Warren', 'Buffet', 7, null),
('Alan', 'Greenspan', 8, 7),
('Benjamin', 'Allaboutthe', 9, 7);
