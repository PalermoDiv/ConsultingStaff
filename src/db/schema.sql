-- Consultants position 
CREATE TYPE consultant_position AS ENUM ('...', '...', '...');

-- Consultants table --
CREATE TABLE consultants
(
  consultant_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  age INTEGER,
  position consultant_position,
  assignability BOOLEAN -- Here it would be ideal I guess that if certain condition is not true, then it does not pass 
);

-- Project Managers (The one's who control each project inside of the app)
CREATE TABLE project_managers
(
  project_manager_id INTEGER PRIMARY KEY,
  fk_consultant_id INTEGER,
  FOREIGN KEY (fk_consultant_id) REFERENCES consultants(consultant_id)
); -- Idk is from here it would be ideal to have the project_id assigned for each manager, but each manager could have more than 1, so I guess another table is ideal 

-- Projects Table -- 
CREATE TABLE projects
(
  project_id INTEGER PRIMARY KEY,
  name_project TEXT, 
  start_date DATE,
  amount_of_consultants_active INTEGER,
  fk_consultant_id INTEGER,
  FOREIGN KEY (fk_consultant_id) REFERENCES consultants(consultant_id)
);

-- skills 
CREATE TABLE skills
(
  skill_id INTEGER PRIMARY KEY,
  skill_name TEXT, 
  date_create DATE
);

-- Consultant per skill 
CREATE TABLE consultant_skill
(
  consultant_skill INTEGER PRIMARY KEY, 
  fk_skill_id INTEGER,
  fk_consultant_id INTEGER, 
  FOREIGN KEY (fk_skill_id) REFERENCES skills(skill_id),
  FOREIGN KEY (fk_consultant_id) REFERENCES consultants(consultant_id)
);

-- Project skills 
CREATE TABLE project_skills
(
  project_skill INTEGER PRIMARY KEY, 
  fk_project_id INTEGER,
  fk_skill_id INTEGER,
  FOREIGN KEY (fk_project_id) REFERENCES projects(project_id),
  FOREIGN KEY (fk_skill_id) REFERENCES skills(skill_id)
);

-- Clients table (for whom are we making each project?)
CREATE TABLE clients
(
  client_id INTEGER PRIMARY KEY, 
  client_name TEXT
  -- Idk what more to add 
);
-- project_client 
CREATE TABLE projects_clients
(
  project_client INTEGER PRIMARY KEY, 
  fk_client_id INTEGER, 
  fk_project_id INTEGER, 
  FOREIGN KEY (fk_client_id) REFERENCES clients(client_id),
  FOREIGN KEY (fk_project_id) REFERENCES projects(project_id)
);
-- Idk how to made the assigment one 
