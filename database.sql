-- backend/database.sql

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS masterim_project;
USE masterim_project;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(127) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    token VARCHAR(127) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion d'utilisateurs d'exemple
-- Les mots de passe ont été générés avec bcrypt, niveau de salage 10
INSERT INTO users (username, password, role, token) VALUES
('admin', '$2b$10$EV406.40z/EqsL.2xquzYuTfsb47kJFKzS8tNmlq0sc2NdfQ5QhRy', 'admin', 'admin-token-123'),
('user1', '$2b$10$EV406.40z/EqsL.2xquzYuTfsb47kJFKzS8tNmlq0sc2NdfQ5QhRy', 'user', 'user1-token-abc'),
('user2', '$2b$10$EV406.40z/EqsL.2xquzYuTfsb47kJFKzS8tNmlq0sc2NdfQ5QhRy', 'user', 'user2-token-def');

-- Table des actualités
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(127) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion d'actualités d'exemple
INSERT INTO news (title, content, image_url) VALUES
('Bienvenue à MasterIM', 'Bienvenue sur le site de l\'association MasterIM. Nous sommes ravis de vous accueillir!', 'https://example.com/image1.jpg'),
('Nouvelle Proposition', 'Nous avons une nouvelle proposition à voter. Veuillez consulter la page de vote pour plus de détails.', 'https://example.com/image2.jpg');

-- Table des commentaires
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    news_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
);

-- Insertion de commentaires d'exemple
INSERT INTO comments (content, user_id, news_id) VALUES
('Superbe initiative!', 2, 1),
('J\'ai hâte de voter pour la nouvelle proposition.', 3, 2);

-- Table des propositions de vote
CREATE TABLE proposals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(127) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de propositions de vote d'exemple
INSERT INTO proposals (title, description) VALUES
('Proposition 1', 'Description détaillée de la proposition 1.'),
('Proposition 2', 'Description détaillée de la proposition 2.');

-- Table des votes
CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vote_option ENUM('yes', 'no') NOT NULL,
    user_id INT NOT NULL,
    proposal_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
);

-- Insertion de votes d'exemple
INSERT INTO votes (vote_option, user_id, proposal_id) VALUES
('yes', 2, 1),
('no', 3, 1),
('yes', 2, 2);
