-- =============================================
--  BANCO DE DADOS - GESTÃO DE CURSOS ONLINE
-- =============================================

DROP DATABASE IF EXISTS universidadedb;
CREATE DATABASE universidadedb;
USE universidadedb;

-- =========================
--  PERFIS E USUÁRIOS
-- =========================
CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id    INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(100) NOT NULL
);

CREATE TABLE associated (
    id_user     INT NOT NULL,
    id_profile  INT NOT NULL,
    PRIMARY KEY(id_user, id_profile),
    FOREIGN KEY(id_user) REFERENCES users(id),
    FOREIGN KEY(id_profile) REFERENCES user_profiles(id)
);

-- =========================
--  CURSOS E TURMAS
-- =========================
CREATE TABLE courses (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    description  VARCHAR(255),
    max_students INT NOT NULL
);

CREATE TABLE classes (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    id_courses   INT NOT NULL,
    id_teacher   INT NOT NULL,
    starts_on    DATE NOT NULL,
    ends_on      DATE NOT NULL,
    period       VARCHAR(50),
    name         VARCHAR(100) NOT NULL,
    max_students INT NULL,
    archived     BOOLEAN NOT NULL DEFAULT false,

    FOREIGN KEY(id_courses) REFERENCES courses(id),
    FOREIGN KEY(id_teacher) REFERENCES users(id)
);

-- =========================
--  MATRÍCULAS
-- =========================
CREATE TABLE enrolment (
  id_student  INT NOT NULL,
  id_class    INT NOT NULL,
  enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  active      BOOLEAN NOT NULL DEFAULT true,

  PRIMARY KEY(id_student, id_class),
  FOREIGN KEY(id_student) REFERENCES users(id),
  FOREIGN KEY(id_class) REFERENCES classes(id)
);

-- =========================
--  MATERIAIS DE AULA
-- =========================
CREATE TABLE materials (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    id_class    INT NOT NULL,
    title       VARCHAR(50) NOT NULL,
    description VARCHAR(100),
    posted_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(id_class) REFERENCES classes(id)
);

-- =========================
--  ATIVIDADES / SUBMISSÕES / NOTAS
-- =========================
CREATE TABLE activities (
    id  INT AUTO_INCREMENT PRIMARY KEY,
    id_class     INT NOT NULL,
    title        VARCHAR(50) NOT NULL,
    description  VARCHAR(100),
    type         VARCHAR(50),
    max_grade    DECIMAL(3,1) NOT NULL,
    due_date     DATETIME NOT NULL,

    FOREIGN KEY(id_class) REFERENCES classes(id)
);

CREATE TABLE submissions (
    id_student   INT NOT NULL,
    id_activity  INT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    content      VARCHAR(100),
    PRIMARY KEY(id_student, id_activity),

    FOREIGN KEY(id_student) REFERENCES users(id),
    FOREIGN KEY(id_activity) REFERENCES activities(id)
);

CREATE TABLE grades (
    id_student      INT NOT NULL,
    id_activity     INT NOT NULL,
    grade           DECIMAL(3,1) NOT NULL,
    submission_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id_student, id_activity),
    FOREIGN KEY(id_student) REFERENCES users(id),
    FOREIGN KEY(id_activity) REFERENCES activities(id)
);

-- =========================
--  HISTÓRICO 
-- =========================
CREATE TABLE history (
    id_student  INT NOT NULL,
    id_class    INT NOT NULL,
    final_grade DECIMAL(3,1),
    status      VARCHAR(20),
    PRIMARY KEY(id_student, id_class),
    FOREIGN KEY(id_student) REFERENCES users(id),
    FOREIGN KEY(id_class) REFERENCES classes(id)
);

-- =============================================
-- POPULAÇÃO INICIAL DO BANCO universidadedb
-- =============================================

-- -- PERFIS DE USUÁRIO
INSERT INTO user_profiles (id, name) VALUES
  (1, 'ADMIN'),
  (2, 'TEACHER'),
  (3, 'STUDENT');

-- -- USUÁRIOS
-- INSERT INTO users (id_users, name, email, password) VALUES
--   (1, 'Ana Souza',      'ana.admin@uni.com',   'senha123'),
--   (2, 'Bruno Lima',     'bruno.prof@uni.com',  'senha123'),
--   (3, 'Carla Torres',   'carla.prof@uni.com',  'senha123'),
--   (4, 'Diego Alves',    'diego.aluno@uni.com', 'senha123'),
--   (5, 'Eduarda Rocha',  'eduarda.aluna@uni.com','senha123'),
--   (6, 'Felipe Costa',   'felipe.aluno@uni.com','senha123'),
--   (7, 'Gabriela Menezes','gabriela.aluna@uni.com','senha123');

-- -- ASSOCIAÇÃO USUÁRIO x PERFIL
-- -- Ana: apenas ADMIN
-- INSERT INTO associated (user_id, profile_id) VALUES
--   (1, 1),  -- Ana -> ADMIN

-- -- Bruno: apenas TEACHER
--   (2, 2),  -- Bruno -> TEACHER

-- -- Carla: professora e também aluna
--   (3, 2),  -- Carla -> TEACHER
--   (3, 3),  -- Carla -> STUDENT

-- -- Demais: apenas alunos
--   (4, 3),  -- Diego -> STUDENT
--   (5, 3),  -- Eduarda -> STUDENT
--   (6, 3),  -- Felipe -> STUDENT
--   (7, 3);  -- Gabriela -> STUDENT

-- -- CURSOS
-- INSERT INTO courses (id_courses, name, description, max_students) VALUES
--   (1, 'Banco de Dados I',  'Introdução a bancos de dados relacionais.', 40),
--   (2, 'Programação Web',   'Fundamentos de desenvolvimento Web.',       35),
--   (3, 'Algoritmos',        'Lógica de programação e estruturas básicas.', 50);

-- -- TURMAS
-- INSERT INTO classes (id_classes, courses_id, teacher_id, starts_on, ends_on,
--                      period, name, max_students, archived) VALUES
--   (1, 1, 2, '2025-02-10', '2025-06-30', '2025.1',
--    'Banco de Dados I - Turma A', 30, FALSE),

--   (2, 1, 3, '2024-08-01', '2024-12-15', '2024.2',
--    'Banco de Dados I - Turma B', 35, TRUE),   -- turma já encerrada

--   (3, 2, 3, '2025-02-10', '2025-06-30', '2025.1',
--    'Programação Web - Turma A', 35, FALSE),

--   (4, 3, 2, '2025-02-10', '2025-06-30', '2025.1',
--    'Algoritmos - Turma A', 40, FALSE);

-- -- MATRÍCULAS (ENROLMENT)
-- INSERT INTO enrolment (student_id, class_id, enrolled_at, active) VALUES
--   -- Turma 1 (BD I - A): Carla (como aluna), Diego e Eduarda
--   (3, 1, '2025-02-05 10:00:00', TRUE),
--   (4, 1, '2025-02-06 09:30:00', TRUE),
--   (5, 1, '2025-02-06 09:45:00', TRUE),

--   -- Turma 3 (Prog Web - A): Diego, Felipe e Gabriela
--   (4, 3, '2025-02-07 11:00:00', TRUE),
--   (6, 3, '2025-02-07 11:10:00', TRUE),
--   (7, 3, '2025-02-07 11:15:00', TRUE),

--   -- Turma 4 (Algoritmos - A): Eduarda e Felipe
--   (5, 4, '2025-02-08 14:00:00', TRUE),
--   (6, 4, '2025-02-08 14:05:00', TRUE),

--   -- Turma 2 (BD I - B, já encerrada): Carla e Diego
--   (3, 2, '2024-08-02 09:00:00', FALSE),
--   (4, 2, '2024-08-02 09:05:00', FALSE);

-- -- MATERIAIS DE AULA
-- INSERT INTO materials (id, class_id, title, description, posted_at) VALUES
--   (1, 1, 'Plano de Ensino', 'Ementa e cronograma da disciplina.', '2025-02-09 08:00:00'),
--   (2, 1, 'Introdução a SQL', 'Slides da primeira aula.',         '2025-02-11 10:00:00'),
--   (3, 3, 'HTML Básico',      'Material introdutório de HTML.',   '2025-02-11 09:30:00'),
--   (4, 4, 'Lista 1 - Algoritmos', 'Exercícios de lógica.',        '2025-02-12 15:00:00');

-- -- ATIVIDADES
-- INSERT INTO activities (id_activity, class_id, title, description, type,
--                         max_grade, due_date) VALUES
--   (1, 1, 'Trabalho 1 - BD', 'Modelagem de banco de dados.', 'TRABALHO', 10.0, '2025-03-15 23:59:00'),
--   (2, 1, 'Prova 1 - BD',    'Avaliação teórica.',           'PROVA',    10.0, '2025-04-10 23:59:00'),
--   (3, 3, 'Projeto Web',     'Criação de site estático.',    'PROJETO',  10.0, '2025-04-01 23:59:00'),
--   (4, 4, 'Lista Avaliativa', 'Lista de exercícios avaliativa.', 'LISTA', 10.0, '2025-03-20 23:59:00'),
--   (5, 1, 'Prova 2 - BD', 'Prova final com teoria e prática.', 'PROVA', 10.0, '2025-06-30 23:59:00'),
--   (6, 4, 'Prova 2 - Algoritmos', 'Prova final de lógica.', 'PROVA', 10.0, '2025-06-30 23:59:00');


-- -- SUBMISSÕES
-- INSERT INTO submissions (student_id, activity_id, submitted_at, content) VALUES
--   -- Atividade 1 (Trabalho 1 - BD)
--   (3, 1, '2025-03-10 20:00:00', 'Modelo conceitual e lógico em PDF.'),
--   (4, 1, '2025-03-14 18:30:00', 'Trabalho em PDF com DER.'),
--   (5, 1, '2025-03-15 21:10:00', 'Trabalho com DER e script SQL.'),

--   -- Atividade 2 (Prova 1 - BD) - supondo prova online
--   (3, 2, '2025-04-10 19:00:00', 'Respostas da prova 1.'),
--   (4, 2, '2025-04-10 19:05:00', 'Respostas da prova 1.'),

--   -- Atividade 3 (Projeto Web)
--   (4, 3, '2025-03-30 22:00:00', 'Link para repositório do projeto.'),
--   (6, 3, '2025-03-31 21:45:00', 'Projeto zipado.'),
--   (7, 3, '2025-03-31 22:10:00', 'Projeto hospedado no GitHub Pages.'),

--   -- Atividade 4 (Lista Avaliativa - Algoritmos)
--   (5, 4, '2025-03-18 20:30:00', 'Lista resolvida em PDF.'),
--   (6, 4, '2025-03-19 21:00:00', 'Lista resolvida em arquivo DOC.'),

--   (4, 5, '2025-06-20 19:00:00', 'Prova 2 enviada.'),
--   (6, 6, '2025-06-20 19:30:00', 'Prova 2 enviada.');


-- -- NOTAS
-- INSERT INTO grades (student_id, id_activity, grade, submission_date) VALUES
--   -- Notas do Trabalho 1 - BD
--   (3, 1, 9.0, '2025-03-20'),
--   (4, 1, 7.5, '2025-03-20'),
--   (5, 1, 8.5, '2025-03-20'),

--   -- Notas da Prova 1 - BD
--   (3, 2, 8.0, '2025-04-15'),
--   (4, 2, 4.0, '2025-04-15'),

--   -- Notas do Projeto Web
--   (4, 3, 9.5, '2025-04-05'),
--   (6, 3, 7.0, '2025-04-05'),
--   (7, 3, 8.5, '2025-04-05'),

--   -- Notas da Lista Avaliativa - Algoritmos
--   (5, 4, 8.0, '2025-03-25'),
--   (6, 4, 7.5, '2025-03-25'),

--   (4, 5, 2.0, '2025-06-25'),
--   (6, 6, 3.0, '2025-06-25');


-- -- HISTÓRICO
-- INSERT INTO history (student_id, class_id, final_grade, status) VALUES
--   -- Turma 2 (BD I - B) já encerrada
--   (3, 2, 7.5, 'APROVADO'),
--   (4, 2, 4.0, 'REPROVADO'),

--   -- Turma 1 (BD I - A) ainda em andamento
--   (3, 1, NULL, 'CURSANDO'),
--   (4, 1, NULL, 'CURSANDO'),
--   (5, 1, NULL, 'CURSANDO'),

--   -- Turma 3 (Prog Web - A) em andamento
--   (4, 3, NULL, 'CURSANDO'),
--   (6, 3, NULL, 'CURSANDO'),
--   (7, 3, NULL, 'CURSANDO'),

--   -- Turma 4 (Algoritmos - A) em andamento
--   (5, 4, NULL, 'CURSANDO'),
--   (6, 4, NULL, 'CURSANDO');

-- -- =============================================
-- -- CONSULTAS IMPORTANTES
-- -- =============================================

-- -- 2.1. Listar a quantidade de alunos em cada turma de um determinado curso
-- -- Troque o valor de c.id_courses na cláusula WHERE pelo curso desejado.
-- SELECT
--     c.id_courses,
--     c.name        AS course_name,
--     cl.id_classes,
--     cl.name       AS class_name,
--     COUNT(DISTINCT e.student_id) AS total_students
-- FROM courses c
-- JOIN classes cl
--     ON cl.courses_id = c.id_courses
-- LEFT JOIN enrolment e
--     ON e.class_id = cl.id_classes
--    AND e.active = TRUE
-- WHERE c.id_courses = 1   -- id do curso desejado (mudar isso no js)
-- GROUP BY
--     c.id_courses, c.name,
--     cl.id_classes, cl.name;

-- -- 2.2. Calcular a média geral de notas por turma de um determinado curso
-- SELECT
--     c.id_courses,
--     c.name        AS course_name,
--     cl.id_classes,
--     cl.name       AS class_name,
--     AVG(g.grade)  AS avg_grade
-- FROM courses c
-- JOIN classes cl
--     ON cl.courses_id = c.id_courses
-- JOIN activities a
--     ON a.class_id = cl.id_classes
-- JOIN grades g
--     ON g.id_activity = a.id_activity
-- WHERE c.id_courses = 1   -- coloque aqui o id do curso desejado
-- GROUP BY
--     c.id_courses, c.name,
--     cl.id_classes, cl.name;

-- -- 2.3. Identificar os alunos com desempenho abaixo da média (< 5)
-- SELECT
--     u.id_users      AS student_id,
--     u.name          AS student_name,
--     cl.id_classes,
--     cl.name         AS class_name,
--     AVG(g.grade)    AS avg_grade
-- FROM users u
-- JOIN associated a
--     ON a.user_id = u.id_users
-- JOIN user_profiles p
--     ON p.id_profiles = a.profile_id
--    AND p.name = 'STUDENT'
-- JOIN enrolment e
--     ON e.student_id = u.id_users
-- JOIN classes cl
--     ON cl.id_classes = e.class_id
-- JOIN activities act
--     ON act.class_id = cl.id_classes
-- JOIN grades g
--     ON g.student_id = u.id_users
--    AND g.id_activity = act.id_activity
-- GROUP BY
--     u.id_users, u.name,
--     cl.id_classes, cl.name
-- HAVING avg_grade < 5.0;

-- -- 2.4. Listar todas as turmas ativas de um determinado professor
-- SELECT
--     cl.id_classes,
--     cl.name       AS class_name,
--     c.name        AS course_name,
--     cl.period,
--     cl.starts_on,
--     cl.ends_on
-- FROM classes cl
-- JOIN users u
--     ON u.id_users = cl.teacher_id
-- JOIN associated a
--     ON a.user_id = u.id_users
-- JOIN user_profiles p
--     ON p.id_profiles = a.profile_id
--    AND p.name = 'TEACHER'
-- JOIN courses c
--     ON c.id_courses = cl.courses_id
-- WHERE cl.archived = FALSE
--   AND cl.teacher_id = 2;   -- id do professor desejado

-- -- 2.5. Indicar o(s) professor(es) com o maior número de turmas ativas
-- WITH teacher_classes AS (
--     SELECT
--         u.id_users   AS teacher_id,
--         u.name       AS teacher_name,
--         COUNT(*)     AS active_classes
--     FROM classes cl
--     JOIN users u
--         ON u.id_users = cl.teacher_id
--     JOIN associated a
--         ON a.user_id = u.id_users
--     JOIN user_profiles p
--         ON p.id_profiles = a.profile_id
--        AND p.name = 'TEACHER'
--     WHERE cl.archived = FALSE
--     GROUP BY
--         u.id_users, u.name
-- )

-- SELECT
--     teacher_id,
--     teacher_name,
--     active_classes
-- FROM teacher_classes
-- WHERE active_classes = (
--     SELECT MAX(active_classes)
--     FROM teacher_classes
-- );

-- -- 2.6. Listar as 3 turmas que tiveram o melhor desempenho médio
-- SELECT
--     cl.id_classes,
--     cl.name          AS class_name,
--     c.name           AS course_name,
--     AVG(h.final_grade) AS avg_final_grade
-- FROM classes cl
-- JOIN courses c
--     ON c.id_courses = cl.courses_id
-- JOIN history h
--     ON h.class_id = cl.id_classes
-- WHERE h.final_grade IS NOT NULL
-- GROUP BY
--     cl.id_classes, cl.name,
--     c.name
-- ORDER BY
--     avg_final_grade DESC
-- LIMIT 3;

-- -- 2.7. Identificar professores que também são alunos
-- SELECT
--     u.id_users,
--     u.name,
--     u.email
-- FROM users u
-- JOIN associated a1
--     ON a1.user_id = u.id_users
-- JOIN user_profiles p1
--     ON p1.id_profiles = a1.profile_id
--    AND p1.name = 'TEACHER'
-- JOIN associated a2
--     ON a2.user_id = u.id_users
-- JOIN user_profiles p2
--     ON p2.id_profiles = a2.profile_id
--    AND p2.name = 'STUDENT';


-- -- 2.8. Identificar qual(is) aluno(s) fez(eram) mais cursos
-- WITH student_courses AS (
--     SELECT
--         u.id_users    AS student_id,
--         u.name        AS student_name,
--         COUNT(DISTINCT c.id_courses) AS total_courses_done
--     FROM users u
--     JOIN associated a
--         ON a.user_id = u.id_users
--     JOIN user_profiles p
--         ON p.id_profiles = a.profile_id
--        AND p.name = 'STUDENT'
--     JOIN history h
--         ON h.student_id = u.id_users
--     JOIN classes cl
--         ON cl.id_classes = h.class_id
--     JOIN courses c
--         ON c.id_courses = cl.courses_id
--     WHERE h.status = 'APROVADO'
--        OR h.final_grade IS NOT NULL
--     GROUP BY
--         u.id_users, u.name
-- )

-- SELECT
--     student_id,
--     student_name,
--     total_courses_done
-- FROM student_courses
-- WHERE total_courses_done = (
--     SELECT MAX(total_courses_done)
--     FROM student_courses
-- );

-- -- 2.9. Arquivar turmas que já atingiram a data de término do período letivo
-- SELECT *
-- FROM classes
-- WHERE archived = FALSE
--   AND ends_on < CURDATE();
-- UPDATE classes
-- SET archived = TRUE
-- WHERE archived = FALSE
--   AND ends_on < CURDATE();
