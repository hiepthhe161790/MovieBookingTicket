CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    address VARCHAR(255),
    birthday DATE,
    email VARCHAR(255),
    name VARCHAR(255),
    gender VARCHAR(10),
    identity_card VARCHAR(50),
    image VARCHAR(255),
    password VARCHAR(255),
    phone_number VARCHAR(50),
    register_date DATE,
    status BOOLEAN,
    username VARCHAR(255) UNIQUE NOT NULL,
    role_id INTEGER REFERENCES role(role_id)
);

CREATE TABLE member (
    member_id SERIAL PRIMARY KEY,
    score INTEGER,
    account_id INTEGER UNIQUE REFERENCES account(account_id)
);

CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY,
    account_id INTEGER UNIQUE REFERENCES account(account_id)
);

CREATE TABLE invoice (
    invoice_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES account(account_id),
    add_score INTEGER,
    booking_date TIMESTAMP,
    movie_name VARCHAR(255),
    schedule_show VARCHAR(255),
    schedule_show_time VARCHAR(255),
    status BOOLEAN,
    total_money INTEGER,
    use_score INTEGER,
    seat VARCHAR(255)
);

CREATE TABLE type (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(255)
);

CREATE TABLE movie (
    movie_id VARCHAR(10) PRIMARY KEY,
    actor VARCHAR(255),
    cinema_room_id INTEGER,
    content VARCHAR(1000),
    director VARCHAR(255),
    duration INTEGER,
    from_date DATE,
    movie_production_company VARCHAR(255),
    to_date DATE,
    version VARCHAR(255),
    movie_name_english VARCHAR(255),
    movie_name_vn VARCHAR(255),
    large_image VARCHAR(255),
    small_image VARCHAR(255)
);

CREATE TABLE schedule (
    schedule_id SERIAL PRIMARY KEY,
    schedule_time VARCHAR(255)
);

CREATE TABLE show_dates (
    show_date_id SERIAL PRIMARY KEY,
    show_date DATE,
    date_name VARCHAR(255)
);

CREATE TABLE movie_type (
    movie_id VARCHAR(10) REFERENCES movie(movie_id),
    type_id INTEGER REFERENCES type(type_id),
    PRIMARY KEY (movie_id, type_id)
);

CREATE TABLE movie_schedule (
    movie_id VARCHAR(10) REFERENCES movie(movie_id),
    schedule_id INTEGER REFERENCES schedule(schedule_id),
    PRIMARY KEY (movie_id, schedule_id)
);

CREATE TABLE movie_date (
    movie_id VARCHAR(10) REFERENCES movie(movie_id),
    show_date_id INTEGER REFERENCES show_dates(show_date_id),
    PRIMARY KEY (movie_id, show_date_id)
);
CREATE TABLE cinema_room (
    cinema_room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT
);
CREATE TABLE seat (
    seat_id SERIAL PRIMARY KEY,
    cinema_room_id INTEGER REFERENCES cinema_room(cinema_room_id),
    row_label VARCHAR(5),      -- Ví dụ: 'A', 'B', 'C'
    seat_number INTEGER,       -- Ví dụ: 1, 2, 3
    seat_code VARCHAR(10),     -- Ví dụ: 'A1', 'B5'
    seat_type VARCHAR(20),     -- Ví dụ: 'VIP', 'NORMAL'
    status BOOLEAN DEFAULT true,
    UNIQUE(cinema_room_id, seat_code)
);

-- Insert Roles
INSERT INTO role (role_name) VALUES ('GUEST'), ('MEMBER'), ('EMPLOYEE'), ('ADMIN');

-- Insert Cinema Rooms
INSERT INTO cinema_room (room_name, capacity, description) VALUES
('Room 1', 120, 'Standard 2D projection with Dolby sound'),
('Room 2', 100, 'IMAX experience with 4K laser projection'),
('Room 3', 80, 'VIP room with recliner seats and premium service'),
('Room 4', 150, 'Large room for blockbuster screenings');

-- Insert Seats (Room 1: 10x12, Room 2: 10x10, Room 3: 8x10, Room 4: 10x15)
INSERT INTO seat (cinema_room_id, row_label, seat_number, seat_code, seat_type, status) VALUES
-- Room 1 (120 seats: rows A–J, seats 1–12)
(1, 'A', 1, 'A1', 'NORMAL', true), (1, 'A', 2, 'A2', 'NORMAL', true), (1, 'A', 3, 'A3', 'NORMAL', true),
(1, 'A', 4, 'A4', 'NORMAL', true), (1, 'A', 5, 'A5', 'NORMAL', true), (1, 'A', 6, 'A6', 'NORMAL', true),
(1, 'A', 7, 'A7', 'NORMAL', true), (1, 'A', 8, 'A8', 'NORMAL', true), (1, 'A', 9, 'A9', 'NORMAL', true),
(1, 'A', 10, 'A10', 'NORMAL', true), (1, 'A', 11, 'A11', 'NORMAL', true), (1, 'A', 12, 'A12', 'NORMAL', true),
(1, 'B', 1, 'B1', 'NORMAL', true), (1, 'B', 2, 'B2', 'NORMAL', true), (1, 'B', 3, 'B3', 'NORMAL', true),
(1, 'B', 4, 'B4', 'NORMAL', true), (1, 'B', 5, 'B5', 'NORMAL', true), (1, 'B', 6, 'B6', 'NORMAL', true),
(1, 'B', 7, 'B7', 'NORMAL', true), (1, 'B', 8, 'B8', 'NORMAL', true), (1, 'B', 9, 'B9', 'NORMAL', true),
(1, 'B', 10, 'B10', 'NORMAL', true), (1, 'B', 11, 'B11', 'NORMAL', true), (1, 'B', 12, 'B12', 'NORMAL', true),
(1, 'C', 1, 'C1', 'VIP', true), (1, 'C', 2, 'C2', 'VIP', true), (1, 'C', 3, 'C3', 'VIP', true),
(1, 'C', 4, 'C4', 'VIP', true), (1, 'C', 5, 'C5', 'VIP', true), (1, 'C', 6, 'C6', 'VIP', true),
(1, 'C', 7, 'C7', 'VIP', true), (1, 'C', 8, 'C8', 'VIP', true), (1, 'C', 9, 'C9', 'VIP', true),
(1, 'C', 10, 'C10', 'VIP', true), (1, 'C', 11, 'C11', 'VIP', true), (1, 'C', 12, 'C12', 'VIP', true),
-- (Rows D–J similar, omitted for brevity)
-- Room 2 (100 seats: rows A–J, seats 1–10)
(2, 'A', 1, 'A1', 'NORMAL', true), (2, 'A', 2, 'A2', 'NORMAL', true), (2, 'A', 3, 'A3', 'NORMAL', true),
(2, 'A', 4, 'A4', 'NORMAL', true), (2, 'A', 5, 'A5', 'NORMAL', true), (2, 'A', 6, 'A6', 'NORMAL', true),
(2, 'A', 7, 'A7', 'NORMAL', true), (2, 'A', 8, 'A8', 'NORMAL', true), (2, 'A', 9, 'A9', 'NORMAL', true),
(2, 'A', 10, 'A10', 'NORMAL', true),
-- (Rows B–J similar, omitted for brevity)
-- Room 3 (80 seats: rows A–H, seats 1–10)
(3, 'A', 1, 'A1', 'VIP', true), (3, 'A', 2, 'A2', 'VIP', true), (3, 'A', 3, 'A3', 'VIP', true),
(3, 'A', 4, 'A4', 'VIP', true), (3, 'A', 5, 'A5', 'VIP', true), (3, 'A', 6, 'A6', 'VIP', true),
(3, 'A', 7, 'A7', 'VIP', true), (3, 'A', 8, 'A8', 'VIP', true), (3, 'A', 9, 'A9', 'VIP', true),
(3, 'A', 10, 'A10', 'VIP', true),
-- (Rows B–H similar, omitted for brevity)
-- Room 4 (150 seats: rows A–J, seats 1–15)
(4, 'A', 1, 'A1', 'NORMAL', true), (4, 'A', 2, 'A2', 'NORMAL', true), (4, 'A', 3, 'A3', 'NORMAL', true),
(4, 'A', 4, 'A4', 'NORMAL', true), (4, 'A', 5, 'A5', 'NORMAL', true), (4, 'A', 6, 'A6', 'NORMAL', true),
(4, 'A', 7, 'A7', 'NORMAL', true), (4, 'A', 8, 'A8', 'NORMAL', true), (4, 'A', 9, 'A9', 'NORMAL', true),
(4, 'A', 10, 'A10', 'NORMAL', true), (4, 'A', 11, 'A11', 'NORMAL', true), (4, 'A', 12, 'A12', 'NORMAL', true),
(4, 'A', 13, 'A13', 'NORMAL', true), (4, 'A', 14, 'A14', 'NORMAL', true), (4, 'A', 15, 'A15', 'NORMAL', true);
-- (Rows B–J similar, omitted for brevity)

-- Insert Types (Genres)
INSERT INTO type (type_name) VALUES
('Action'), ('Comedy'), ('Drama'), ('Horror'), ('Sci-Fi'), ('Romance'), ('Animation');

-- Insert Movies (21 movies, 3 per genre)
INSERT INTO movie (movie_id, actor, cinema_room_id, content, director, duration, from_date, movie_production_company, to_date, version, movie_name_english, movie_name_vn, large_image, small_image) VALUES
-- Action
('M001', 'Tom Cruise, Henry Cavill', 1, 'A rogue agent races to stop a global threat.', 'Christopher McQuarrie', 130, '2025-06-01', 'Paramount', '2025-07-01', '2D', 'Mission: Critical', 'Nhiệm Vụ: Hiểm Hóc', 'https://image.tmdb.org/t/p/w500/mission_critical_poster.jpg', 'https://image.tmdb.org/t/p/w200/mission_critical_poster.jpg'),
('M002', 'Dwayne Johnson, Gal Gadot', 2, 'A heist team battles a tech cartel.', 'Rawson Marshall Thurber', 125, '2025-06-15', 'Netflix', '2025-07-15', 'IMAX', 'Red Vault', 'Kho Đỏ', 'https://image.tmdb.org/t/p/w500/red_vault_poster.jpg', 'https://image.tmdb.org/t/p/w200/red_vault_poster.jpg'),
('M003', 'Keanu Reeves, Ana de Armas', 4, 'A retired assassin faces his past.', 'Chad Stahelski', 115, '2025-06-20', 'Lionsgate', '2025-07-20', '3D', 'Shadow Strike', 'Đòn Tối', 'https://image.tmdb.org/t/p/w500/shadow_strike_poster.jpg', 'https://image.tmdb.org/t/p/w200/shadow_strike_poster.jpg'),
-- Comedy
('M004', 'Ryan Reynolds, Melissa McCarthy', 1, 'A mismatched duo plans a chaotic heist.', 'Shawn Levy', 100, '2025-06-10', '20th Century', '2025-07-10', '2D', 'Big Blunder', 'Sai Lầm Lớn', 'https://image.tmdb.org/t/p/w500/big_blunder_poster.jpg', 'https://image.tmdb.org/t/p/w200/big_blunder_poster.jpg'),
('M005', 'Will Ferrell, Tiffany Haddish', 3, 'A corporate retreat turns into a comedy of errors.', 'Adam McKay', 95, '2025-06-25', 'Sony', '2025-07-25', '2D', 'Team Tumble', 'Đội Ngã', 'https://image.tmdb.org/t/p/w500/team_tumble_poster.jpg', 'https://image.tmdb.org/t/p/w200/team_tumble_poster.jpg'),
('M006', 'Kevin Hart, Kristen Wiig', 4, 'A family vacation goes hilariously wrong.', 'Paul Feig', 105, '2025-06-30', 'Universal', '2025-07-30', '2D', 'Trip Trap', 'Chuyến Đi Bẫy', 'https://image.tmdb.org/t/p/w500/trip_trap_poster.jpg', 'https://image.tmdb.org/t/p/w200/trip_trap_poster.jpg'),
-- Drama
('M007', 'Leonardo DiCaprio, Cate Blanchett', 1, 'A family grapples with loss and redemption.', 'Alejandro G. Iñárritu', 135, '2025-06-05', 'A24', '2025-07-05', '2D', 'Waves of Time', 'Sóng Thời Gian', 'https://image.tmdb.org/t/p/w500/waves_of_time_poster.jpg', 'https://image.tmdb.org/t/p/w200/waves_of_time_poster.jpg'),
('M008', 'Viola Davis, Timothée Chalamet', 2, 'A young man seeks justice in a broken system.', 'Barry Jenkins', 120, '2025-06-15', 'Focus Features', '2025-07-15', '2D', 'Scales of Truth', 'Cân Công Lý', 'https://image.tmdb.org/t/p/w500/scales_of_truth_poster.jpg', 'https://image.tmdb.org/t/p/w200/scales_of_truth_poster.jpg'),
('M009', 'Toni Collette, Florence Pugh', 3, 'A mother and daughter heal old wounds.', 'Greta Gerwig', 110, '2025-06-20', 'Neon', '2025-07-20', '2D', 'Mending Hearts', 'Hàn Gắn Trái Tim', 'https://image.tmdb.org/t/p/w500/mending_hearts_poster.jpg', 'https://image.tmdb.org/t/p/w200/mending_hearts_poster.jpg'),
-- Horror
('M010', 'Anya Taylor-Joy, Ralph Fiennes', 1, 'A haunted manor hides dark secrets.', 'Ari Aster', 105, '2025-06-01', 'Blumhouse', '2025-07-01', '2D', 'Whispering Walls', 'Bức Tường Thì Thầm', 'https://image.tmdb.org/t/p/w500/whispering_walls_poster.jpg', 'https://image.tmdb.org/t/p/w200/whispering_walls_poster.jpg'),
('M011', 'Jenna Ortega, Bill Skarsgård', 4, 'A cursed relic unleashes terror.', 'James Wan', 100, '2025-06-15', 'New Line', '2025-07-15', '2D', 'Relic’s Curse', 'Lời Nguyền Dị Vật', 'https://image.tmdb.org/t/p/w500/relics_curse_poster.jpg', 'https://image.tmdb.org/t/p/w200/relics_curse_poster.jpg'),
('M012', 'Lupita Nyong’o, Jamie Lee Curtis', 2, 'A town faces a supernatural entity.', 'Jordan Peele', 110, '2025-06-30', 'Universal', '2025-07-30', '2D', 'Eclipse of Fear', 'Nhật Thực Kinh Hoàng', 'https://image.tmdb.org/t/p/w500/eclipse_of_fear_poster.jpg', 'https://image.tmdb.org/t/p/w200/eclipse_of_fear_poster.jpg'),
-- Sci-Fi
('M013', 'Chris Pine, Zendaya', 2, 'Explorers uncover an alien civilization.', 'Denis Villeneuve', 140, '2025-06-01', 'Warner Bros', '2025-07-01', 'IMAX', 'Cosmic Dawn', 'Bình Minh Vũ Trụ', 'https://image.tmdb.org/t/p/w500/cosmic_dawn_poster.jpg', 'https://image.tmdb.org/t/p/w200/cosmic_dawn_poster.jpg'),
('M014', 'John Boyega, Natalie Portman', 4, 'A dystopian city battles rogue AI.', 'Alfonso Cuarón', 130, '2025-06-15', 'Netflix', '2025-07-15', '3D', 'Circuit Rebellion', 'Cuộc Nổi Dậy Mạch', 'https://image.tmdb.org/t/p/w500/circuit_rebellion_poster.jpg', 'https://image.tmdb.org/t/p/w200/circuit_rebellion_poster.jpg'),
('M015', 'Ryan Gosling, Ana de Armas', 1, 'A time-traveler faces a paradox.', 'Christopher Nolan', 145, '2025-06-20', 'Warner Bros', '2025-07-20', 'IMAX', 'Temporal Rift', 'Khe Thời Gian', 'https://image.tmdb.org/t/p/w500/temporal_rift_poster.jpg', 'https://image.tmdb.org/t/p/w200/temporal_rift_poster.jpg'),
-- Romance
('M016', 'Emma Stone, Dev Patel', 3, 'A cross-cultural love story unfolds.', 'Wong Kar-wai', 115, '2025-06-10', 'Focus Features', '2025-07-10', '2D', 'Love’s Journey', 'Hành Trình Tình Yêu', 'https://image.tmdb.org/t/p/w500/loves_journey_poster.jpg', 'https://image.tmdb.org/t/p/w200/loves_journey_poster.jpg'),
('M017', 'Margot Robbie, Timothée Chalamet', 1, 'A romance blooms in a coastal town.', 'Nancy Meyers', 105, '2025-06-25', 'Sony', '2025-07-25', '2D', 'Coastal Sparks', 'Tia Lửa Bờ Biển', 'https://image.tmdb.org/t/p/w500/coastal_sparks_poster.jpg', 'https://image.tmdb.org/t/p/w200/coastal_sparks_poster.jpg'),
('M018', 'Lily Collins, Sam Claflin', 4, 'Old lovers reunite at a wedding.', 'Lone Scherfig', 100, '2025-06-30', 'Lionsgate', '2025-07-30', '2D', 'Rekindled Flame', 'Ngọn Lửa Tái Hợp', 'https://image.tmdb.org/t/p/w500/rekindled_flame_poster.jpg', 'https://image.tmdb.org/t/p/w200/rekindled_flame_poster.jpg'),
-- Animation
('M019', 'Tom Holland, Awkwafina', 1, 'A young dragon seeks a legendary treasure.', 'Dean DeBlois', 95, '2025-06-01', 'Pixar', '2025-07-01', '3D', 'Dragon’s Quest', 'Nhiệm Vụ Rồng', 'https://image.tmdb.org/t/p/w500/dragons_quest_poster.jpg', 'https://image.tmdb.org/t/p/w200/dragons_quest_poster.jpg'),
('M020', 'Mila Kunis, Chris Pratt', 2, 'A robot explores a vibrant world.', 'Phil Lord', 90, '2025-06-15', 'DreamWorks', '2025-07-15', '2D', 'Circuit Heart', 'Trái Tim Mạch', 'https://image.tmdb.org/t/p/w500/circuit_heart_poster.jpg', 'https://image.tmdb.org/t/p/w200/circuit_heart_poster.jpg'),
('M021', 'Kristen Bell, Eddie Redmayne', 3, 'A penguin embarks on an epic adventure.', 'Chris Buck', 85, '2025-06-20', 'Disney', '2025-07-20', '3D', 'Polar Trek', 'Hành Trình Bắc Cực', 'https://image.tmdb.org/t/p/w500/polar_trek_poster.jpg', 'https://image.tmdb.org/t/p/w200/polar_trek_poster.jpg');
UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMTg4MDk1ODExN15BMl5BanBnXkFtZTgwNzIyNjg3MDE@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMTg4MDk1ODExN15BMl5BanBnXkFtZTgwNzIyNjg3MDE@._V1_SX300.jpg'
WHERE movie_id = 'M001';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMzIxN2IzOGItOTcyZi00MTkzLWE4ZjktZTdlOWFiYWE4NzlmXkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMzIxN2IzOGItOTcyZi00MTkzLWE4ZjktZTdlOWFiYWE4NzlmXkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M002';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BZGRmMGRhOWMtOTk3Ni00OTRjLTkyYTAtYzA1M2IzMGE3NGRkXkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BZGRmMGRhOWMtOTk3Ni00OTRjLTkyYTAtYzA1M2IzMGE3NGRkXkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M003';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BOGZlN2EzOTYtMzUzOS00NTM3LTg0MTQtZDVjZGM4YmJlNWNhXkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BOGZlN2EzOTYtMzUzOS00NTM3LTg0MTQtZDVjZGM4YmJlNWNhXkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M004';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMjE1MDYxOTA4MF5BMl5BanBnXkFtZTcwMDE0MDUzMw@@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMjE1MDYxOTA4MF5BMl5BanBnXkFtZTcwMDE0MDUzMw@@._V1_SX300.jpg'
WHERE movie_id = 'M005';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BZjZlOTgzNmUtNjZlYS00NWFjLTg4ZDktMWY4NDIxMjVjZjdhXkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BZjZlOTgzNmUtNjZlYS00NWFjLTg4ZDktMWY4NDIxMjVjZjdhXkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M006';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMTcyNTEyOTY0M15BMl5BanBnXkFtZTgwOTAyNzU3MDI@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMTcyNTEyOTY0M15BMl5BanBnXkFtZTgwOTAyNzU3MDI@._V1_SX300.jpg'
WHERE movie_id = 'M007';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BNDE2NTIyMjg2OF5BMl5BanBnXkFtZTYwNDEyMTg3._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BNDE2NTIyMjg2OF5BMl5BanBnXkFtZTYwNDEyMTg3._V1_SX300.jpg'
WHERE movie_id = 'M008';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMjExNDQwM2QtYjFiNy00N2ZlLWE4ZGEtODdmYjY5NDdhNWE3XkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMjExNDQwM2QtYjFiNy00N2ZlLWE4ZGEtODdmYjY5NDdhNWE3XkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M009';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BOTFiNzRiOWEtYTQwNy00NmRiLWE0ZWYtNTE0YjExZjFmZjkwXkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BOTFiNzRiOWEtYTQwNy00NmRiLWE0ZWYtNTE0YjExZjFmZjkwXkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M010';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BNjllYzVjNjItYjQ2Ni00OGU4LTlkYjItMDYxOTBlM2YzNDA5XkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BNjllYzVjNjItYjQ2Ni00OGU4LTlkYjItMDYxOTBlM2YzNDA5XkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M011';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMTg4NzQ3NDM1Nl5BMl5BanBnXkFtZTcwNjEzMjM3OA@@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMTg4NzQ3NDM1Nl5BMl5BanBnXkFtZTcwNjEzMjM3OA@@._V1_SX300.jpg'
WHERE movie_id = 'M012';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMTA3NDM5ODU3NzleQTJeQWpwZ15BbWU3MDgyMjgyNDE@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMTA3NDM5ODU3NzleQTJeQWpwZ15BbWU3MDgyMjgyNDE@._V1_SX300.jpg'
WHERE movie_id = 'M013';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMTY3MjU0NDA0OF5BMl5BanBnXkFtZTgwNTc0MTU3OTE@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMTY3MjU0NDA0OF5BMl5BanBnXkFtZTgwNTc0MTU3OTE@._V1_SX300.jpg'
WHERE movie_id = 'M014';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BZTRhZDUzMjktOTJhMC00YjNlLTk5YjAtNTdiYTVmMzc1YTQ1XkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BZTRhZDUzMjktOTJhMC00YjNlLTk5YjAtNTdiYTVmMzc1YTQ1XkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M015';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BZDkzNmZmZDUtNjA5Mi00OTM4LTk2MDAtNmRhYTkzM2Y4MWNiXkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BZDkzNmZmZDUtNjA5Mi00OTM4LTk2MDAtNmRhYTkzM2Y4MWNiXkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M016';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BYzFjMzNjOTktNDBlNy00YWZhLWExYTctZDcxNDA4OWVhOTJjXkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BYzFjMzNjOTktNDBlNy00YWZhLWExYTctZDcxNDA4OWVhOTJjXkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M017';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMTIzMDQyNDgwNl5BMl5BanBnXkFtZTcwMDA0MTc3MQ@@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMTIzMDQyNDgwNl5BMl5BanBnXkFtZTcwMDA0MTc3MQ@@._V1_SX300.jpg'
WHERE movie_id = 'M018';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMTIzMTc1OTUxOV5BMl5BanBnXkFtZTYwNTMxODc3._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMTIzMTc1OTUxOV5BMl5BanBnXkFtZTYwNTMxODc3._V1_SX300.jpg'
WHERE movie_id = 'M019';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BNzEzYjhkYTctMWNmZS00MTc5LWI4OWUtZjFkNzNkYTNkMTJlXkEyXkFqcGc@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BNzEzYjhkYTctMWNmZS00MTc5LWI4OWUtZjFkNzNkYTNkMTJlXkEyXkFqcGc@._V1_SX300.jpg'
WHERE movie_id = 'M020';

UPDATE movie SET
  large_image = 'https://m.media-amazon.com/images/M/MV5BMTkyOTkwNDc1N15BMl5BanBnXkFtZTgwNzkyMzk3NjM@._V1_SX300.jpg',
  small_image = 'https://m.media-amazon.com/images/M/MV5BMTkyOTkwNDc1N15BMl5BanBnXkFtZTgwNzkyMzk3NjM@._V1_SX300.jpg'
WHERE movie_id = 'M021';
-- Insert Movie Types
INSERT INTO movie_type (movie_id, type_id) VALUES
('M001', 1), ('M002', 1), ('M003', 1), -- Action
('M004', 2), ('M005', 2), ('M006', 2), -- Comedy
('M007', 3), ('M008', 3), ('M009', 3), -- Drama
('M010', 4), ('M011', 4), ('M012', 4), -- Horror
('M013', 5), ('M014', 5), ('M015', 5), -- Sci-Fi
('M016', 6), ('M017', 6), ('M018', 6), -- Romance
('M019', 7), ('M020', 7), ('M021', 7); -- Animation

-- Insert Schedules (Showtimes)
INSERT INTO schedule (schedule_time) VALUES
('09:30'), ('12:30'), ('15:30'), ('18:30'), ('21:30'), ('23:00');

-- Insert Show Dates
INSERT INTO show_dates (show_date, date_name) VALUES
('2025-06-17', 'Tuesday'), ('2025-06-18', 'Wednesday'), ('2025-06-19', 'Thursday'),
('2025-06-20', 'Friday'), ('2025-06-21', 'Saturday'), ('2025-06-22', 'Sunday'),
('2025-06-23', 'Monday');

-- Insert Movie Schedules
INSERT INTO movie_schedule (movie_id, schedule_id) VALUES
('M001', 1), ('M001', 3), ('M001', 5), -- Mission: Critical
('M002', 2), ('M002', 4), ('M002', 6), -- Red Vault
('M003', 1), ('M003', 3), -- Shadow Strike
('M004', 2), ('M004', 4), -- Big Blunder
('M005', 1), ('M005', 5), -- Team Tumble
('M006', 3), ('M006', 6), -- Trip Trap
('M007', 2), ('M007', 4), -- Waves of Time
('M008', 1), ('M008', 3), -- Scales of Truth
('M009', 5), ('M009', 6), -- Mending Hearts
('M010', 3), ('M010', 5), -- Whispering Walls
('M011', 1), ('M011', 4), -- Relic’s Curse
('M012', 2), ('M012', 6), -- Eclipse of Fear
('M013', 1), ('M013', 3), ('M013', 5), -- Cosmic Dawn
('M014', 2), ('M014', 4), -- Circuit Rebellion
('M015', 1), ('M015', 6), -- Temporal Rift
('M016', 3), ('M016', 5), -- Love’s Journey
('M017', 2), ('M017', 4), -- Coastal Sparks
('M018', 1), ('M018', 6), -- Rekindled Flame
('M019', 3), ('M019', 5), -- Dragon’s Quest
('M020', 2), ('M020', 4), -- Circuit Heart
('M021', 1), ('M021', 3); -- Polar Trek

-- Insert Movie Dates
INSERT INTO movie_date (movie_id, show_date_id) VALUES
('M001', 1), ('M001', 2), ('M001', 3), ('M001', 4), -- Mission: Critical
('M002', 2), ('M002', 3), ('M002', 5), ('M002', 6), -- Red Vault
('M003', 1), ('M003', 4), ('M003', 7), -- Shadow Strike
('M004', 2), ('M004', 5), ('M004', 6), -- Big Blunder
('M005', 1), ('M005', 3), ('M005', 7), -- Team Tumble
('M006', 2), ('M006', 4), ('M006', 6), -- Trip Trap
('M007', 1), ('M007', 5), ('M007', 7), -- Waves of Time
('M008', 2), ('M008', 3), ('M008', 6), -- Scales of Truth
('M009', 1), ('M009', 4), ('M009', 7), -- Mending Hearts
('M010', 2), ('M010', 5), ('M010', 6), -- Whispering Walls
('M011', 1), ('M011', 3), ('M011', 7), -- Relic’s Curse
('M012', 2), ('M012', 4), ('M012', 6), -- Eclipse of Fear
('M013', 1), ('M013', 5), ('M013', 7), -- Cosmic Dawn
('M014', 2), ('M014', 3), ('M014', 6), -- Circuit Rebellion
('M015', 1), ('M015', 4), ('M015', 7), -- Temporal Rift
('M016', 2), ('M016', 5), ('M016', 6), -- Love’s Journey
('M017', 1), ('M017', 3), ('M017', 7), -- Coastal Sparks
('M018', 2), ('M018', 4), ('M018', 6), -- Rekindled Flame
('M019', 1), ('M019', 5), ('M019', 7), -- Dragon’s Quest
('M020', 2), ('M020', 3), ('M020', 6), -- Circuit Heart
('M021', 1), ('M021', 4), ('M021', 7); -- Polar Trek

-- Insert Accounts (40 members, 5 employees, 5 admins)
INSERT INTO account (address, birthday, email, name, gender, identity_card, image, password, phone_number, register_date, status, username, role_id) VALUES
('123 Lê Lợi, Hà Nội', '1995-03-15', 'nguyen.van.a@gmail.com', 'Nguyễn Văn An', 'Male', '123456789012', 'user1.jpg', 'pass123', '0901234567', '2025-01-01', true, 'nguyenvana', 2),
('456 Trần Hưng Đạo, TP.HCM', '1998-07-22', 'tran.thi.b@gmail.com', 'Trần Thị Bình', 'Female', '987654321012', 'user2.jpg', 'pass456', '0912345678', '2025-01-02', true, 'tranthib', 2),
('789 Nguyễn Huệ, Đà Nẵng', '1993-11-10', 'le.van.c@gmail.com', 'Lê Văn Cường', 'Male', '456789123012', 'user3.jpg', 'pass789', '0923456789', '2025-01-03', true, 'levanc', 2),
('101 Hoàng Diệu, Hải Phòng', '2000-05-05', 'pham.thi.d@gmail.com', 'Phạm Thị Duyên', 'Female', '321654987012', 'user4.jpg', 'pass101', '0934567890', '2025-01-04', true, 'phamthid', 2),
('222 Phạm Ngũ Lão, Hà Nội', '1997-09-18', 'hoang.van.e@gmail.com', 'Hoàng Văn Em', 'Male', '789123456012', 'user5.jpg', 'pass222', '0945678901', '2025-01-05', true, 'hoangvane', 2),
-- (35 more members, omitted for brevity, similar format with unique usernames, emails, etc.)
('333 Nguyễn Trãi, TP.HCM', '1990-04-12', 'vu.thi.k@gmail.com', 'Vũ Thị Kim', 'Female', '654987321012', 'emp1.jpg', 'emp123', '0981234567', '2025-01-10', true, 'vuthik', 3),
('444 Lý Thường Kiệt, Hà Nội', '1988-08-25', 'bui.van.l@gmail.com', 'Bùi Văn Long', 'Male', '147258369012', 'emp2.jpg', 'emp456', '0982345678', '2025-01-11', true, 'buivanl', 3),
('555 Tôn Đức Thắng, Đà Nẵng', '1992-06-30', 'do.thi.m@gmail.com', 'Đỗ Thị Mai', 'Female', '258369147012', 'emp3.jpg', 'emp789', '0983456789', '2025-01-12', true, 'dothim', 3),
('666 Bà Triệu, Hà Nội', '1985-12-01', 'ngo.van.n@gmail.com', 'Ngô Văn Nam', 'Male', '369147258012', 'emp4.jpg', 'emp101', '0984567890', '2025-01-13', true, 'ngovann', 3),
('777 Lê Đại Hành, TP.HCM', '1991-03-20', 'dang.thi.o@gmail.com', 'Đặng Thị Oanh', 'Female', '741852963012', 'emp5.jpg', 'emp222', '0985678901', '2025-01-14', true, 'dangthio', 3),
('888 Hai Bà Trưng, Hà Nội', '1987-10-15', 'truong.van.p@gmail.com', 'Trương Văn Phong', 'Male', '852963741012', 'adm1.jpg', 'adm123', '0991234567', '2025-01-15', true, 'truongvanp', 4),
('999 Nguyễn Đình Chiểu, TP.HCM', '1989-02-28', 'luu.thi.q@gmail.com', 'Lưu Thị Quỳnh', 'Female', '963741852012', 'adm2.jpg', 'adm456', '0992345678', '2025-01-16', true, 'luuthiq', 4),
('111 Hùng Vương, Đà Nẵng', '1994-07-07', 'cao.van.r@gmail.com', 'Cao Văn Rực', 'Male', '159753486012', 'adm3.jpg', 'adm789', '0993456789', '2025-01-17', true, 'caovanr', 4),
('222 Điện Biên Phủ, Hà Nội', '1986-01-19', 'ha.thi.s@gmail.com', 'Hà Thị Sen', 'Female', '753159486012', 'adm4.jpg', 'adm101', '0994567890', '2025-01-18', true, 'hathis', 4),
('333 Cách Mạng Tháng Tám, TP.HCM', '1990-05-23', 'vo.van.t@gmail.com', 'Võ Văn Tuấn', 'Male', '486753159012', 'adm5.jpg', 'adm222', '0995678901', '2025-01-19', true, 'vovant', 4),
('666 Hai Bà Trưng, Hà Nội', '1999-07-16', 'pham.van.i@gmail.com', 'Phạm Văn I', 'Male', '123456789016', 'user6.jpg', 'pass123', '0901234571', '2025-01-06', true, 'phamvani', 2),
('777 Nguyễn Trãi, TP.HCM', '2000-08-18', 'hoang.thi.j@gmail.com', 'Hoàng Thị J', 'Female', '123456789017', 'user7.jpg', 'pass123', '0901234572', '2025-01-07', true, 'hoangthij', 2),
('888 Lý Thường Kiệt, Hà Nội', '1994-09-20', 'nguyen.van.k@gmail.com', 'Nguyễn Văn K', 'Male', '123456789018', 'user8.jpg', 'pass123', '0901234573', '2025-01-08', true, 'nguyenvank', 2),
('999 Tôn Đức Thắng, Đà Nẵng', '1995-10-22', 'tran.van.l@gmail.com', 'Trần Văn L', 'Male', '123456789019', 'user9.jpg', 'pass123', '0901234574', '2025-01-09', true, 'tranvanl', 2),
('111 Bà Triệu, Hà Nội', '1996-11-24', 'le.thi.m@gmail.com', 'Lê Thị M', 'Female', '123456789020', 'user10.jpg', 'pass123', '0901234575', '2025-01-10', true, 'lethim', 2),
('222 Nguyễn Văn Cừ, TP.HCM', '1997-12-26', 'pham.van.n@gmail.com', 'Phạm Văn N', 'Male', '123456789021', 'user11.jpg', 'pass123', '0901234576', '2025-01-11', true, 'phamvann', 2),
('333 Lê Văn Sỹ, Đà Nẵng', '1998-01-28', 'hoang.van.o@gmail.com', 'Hoàng Văn O', 'Male', '123456789022', 'user12.jpg', 'pass123', '0901234577', '2025-01-12', true, 'hoangvano', 2),
('444 Phạm Văn Đồng, Hà Nội', '1999-02-28', 'nguyen.thi.p@gmail.com', 'Nguyễn Thị P', 'Female', '123456789023', 'user13.jpg', 'pass123', '0901234578', '2025-01-13', true, 'nguyenthip', 2),
('555 Hai Bà Trưng, TP.HCM', '2000-03-02', 'tran.van.q@gmail.com', 'Trần Văn Q', 'Male', '123456789024', 'user14.jpg', 'pass123', '0901234579', '2025-01-14', true, 'tranvanq', 2),
('666 Nguyễn Trãi, Đà Nẵng', '1994-04-04', 'le.van.r@gmail.com', 'Lê Văn R', 'Male', '123456789025', 'user15.jpg', 'pass123', '0901234580', '2025-01-15', true, 'levanr', 2),
('777 Lý Thường Kiệt, Hà Nội', '1995-05-06', 'pham.thi.s@gmail.com', 'Phạm Thị S', 'Female', '123456789026', 'user16.jpg', 'pass123', '0901234581', '2025-01-16', true, 'phamthis', 2),
('888 Tôn Đức Thắng, TP.HCM', '1996-06-08', 'hoang.van.t@gmail.com', 'Hoàng Văn T', 'Male', '123456789027', 'user17.jpg', 'pass123', '0901234582', '2025-01-17', true, 'hoangvant', 2),
('999 Bà Triệu, Đà Nẵng', '1997-07-10', 'nguyen.van.u@gmail.com', 'Nguyễn Văn U', 'Male', '123456789028', 'user18.jpg', 'pass123', '0901234583', '2025-01-18', true, 'nguyenvanu', 2),
('111 Nguyễn Văn Cừ, Hà Nội', '1998-08-12', 'tran.thi.v@gmail.com', 'Trần Thị V', 'Female', '123456789029', 'user19.jpg', 'pass123', '0901234584', '2025-01-19', true, 'tranthiv', 2),
('222 Lê Văn Sỹ, TP.HCM', '1999-09-14', 'le.van.x@gmail.com', 'Lê Văn X', 'Male', '123456789030', 'user20.jpg', 'pass123', '0901234585', '2025-01-20', true, 'levanx', 2),
('333 Phạm Văn Đồng, Đà Nẵng', '2000-10-16', 'pham.van.y@gmail.com', 'Phạm Văn Y', 'Male', '123456789031', 'user21.jpg', 'pass123', '0901234586', '2025-01-21', true, 'phamvany', 2),
('444 Hai Bà Trưng, Hà Nội', '1994-11-18', 'hoang.thi.z@gmail.com', 'Hoàng Thị Z', 'Female', '123456789032', 'user22.jpg', 'pass123', '0901234587', '2025-01-22', true, 'hoangthiz', 2),
('555 Nguyễn Trãi, TP.HCM', '1995-12-20', 'nguyen.van.aa@gmail.com', 'Nguyễn Văn AA', 'Male', '123456789033', 'user23.jpg', 'pass123', '0901234588', '2025-01-23', true, 'nguyenvanaa', 2),
('666 Lý Thường Kiệt, Đà Nẵng', '1996-01-22', 'tran.van.bb@gmail.com', 'Trần Văn BB', 'Male', '123456789034', 'user24.jpg', 'pass123', '0901234589', '2025-01-24', true, 'tranvanbb', 2),
('777 Tôn Đức Thắng, Hà Nội', '1997-02-24', 'le.thi.cc@gmail.com', 'Lê Thị CC', 'Female', '123456789035', 'user25.jpg', 'pass123', '0901234590', '2025-01-25', true, 'lethicc', 2),
('888 Bà Triệu, TP.HCM', '1998-03-26', 'pham.van.dd@gmail.com', 'Phạm Văn DD', 'Male', '123456789036', 'user26.jpg', 'pass123', '0901234591', '2025-01-26', true, 'phamvadd', 2),
('999 Nguyễn Văn Cừ, Đà Nẵng', '1999-04-28', 'hoang.van.ee@gmail.com', 'Hoàng Văn EE', 'Male', '123456789037', 'user27.jpg', 'pass123', '0901234592', '2025-01-27', true, 'hoangvanee', 2),
('111 Lê Văn Sỹ, Hà Nội', '2000-05-30', 'nguyen.thi.ff@gmail.com', 'Nguyễn Thị FF', 'Female', '123456789038', 'user28.jpg', 'pass123', '0901234593', '2025-01-28', true, 'nguyenthiff', 2),
('222 Phạm Văn Đồng, TP.HCM', '1994-06-01', 'tran.van.gg@gmail.com', 'Trần Văn GG', 'Male', '123456789039', 'user29.jpg', 'pass123', '0901234594', '2025-01-29', true, 'tranvangg', 2),
('333 Hai Bà Trưng, Đà Nẵng', '1995-07-03', 'le.van.hh@gmail.com', 'Lê Văn HH', 'Male', '123456789040', 'user30.jpg', 'pass123', '0901234595', '2025-01-30', true, 'levanhh', 2),
('444 Nguyễn Văn Cừ, Hà Nội', '1996-03-12', 'tran.thi.ii@gmail.com', 'Trần Thị II', 'Female', '123456789041', 'user31.jpg', 'pass123', '0901234596', '2025-02-01', true, 'admin', 4),
('555 Lê Lợi, TP.HCM', '1997-04-15', 'nguyen.thi.jj@gmail.com', 'Nguyễn Thị JJ', 'Female', '123456789042', 'user32.jpg', 'pass123', '0901234597', '2025-02-02', true, 'employee', 3),
('666 Trần Phú, Đà Nẵng', '1998-05-20', 'pham.thi.kk@gmail.com', 'Phạm Thị KK', 'Female', '123456789043', 'user33.jpg', 'pass123', '0901234598', '2025-02-03', true, 'phamthikk', 2),
('777 Hai Bà Trưng, Hải Phòng', '1999-06-25', 'hoang.thi.ll@gmail.com', 'Hoàng Thị LL', 'Female', '123456789044', 'user34.jpg', 'pass123', '0901234599', '2025-02-04', true, 'hoangthill', 2),
('888 Nguyễn Huệ, Hà Nội', '2000-07-30', 'le.thi.mm@gmail.com', 'Lê Thị MM', 'Female', '123456789045', 'user35.jpg', 'pass123', '0901234600', '2025-02-05', true, 'lethimm', 2),
('999 Phạm Văn Đồng, TP.HCM', '1995-08-10', 'dang.thi.nn@gmail.com', 'Đặng Thị NN', 'Female', '123456789046', 'user36.jpg', 'pass123', '0901234601', '2025-02-06', true, 'dangthinn', 2),
('111 Lý Thường Kiệt, Đà Nẵng', '1996-09-15', 'vu.thi.oo@gmail.com', 'Vũ Thị OO', 'Female', '123456789047', 'user37.jpg', 'pass123', '0901234602', '2025-02-07', true, 'vuthioo', 2);
UPDATE account SET gender = 'MALE' WHERE gender = 'Male';
UPDATE account SET gender = 'FEMALE' WHERE gender = 'Female';

-- Insert Members (40 members)
INSERT INTO member (score, account_id) VALUES
(100, 1), (50, 2), (200, 3), (0, 4), (150, 5),
(120, 6), (90, 7), (60, 8), (110, 9), (80, 10),
(130, 11), (70, 12), (140, 13), (50, 14), (160, 15),
(90, 16), (100, 17), (75, 18), (85, 19), (95, 20),
(110, 21), (65, 22), (125, 23), (55, 24), (135, 25),
(80, 26), (105, 27), (70, 28), (115, 29), (60, 30),
(140, 31), (90, 32), (100, 33), (75, 34), (120, 35),
(85, 36), (95, 37), (110, 38), (65, 39), (75, 40);


-- Insert Employees (5 employees)
INSERT INTO employee (account_id) VALUES
(1), (2), (3), (4), (5);

-- Insert Invoices (20 sample bookings)
INSERT INTO invoice (account_id, add_score, booking_date, movie_name, schedule_show, schedule_show_time, status, total_money, use_score, seat) VALUES
(1, 20, '2025-06-17 10:00:00', 'Mission: Critical', 'Room 1', '09:30', true, 120000, 0, 'A1'),
(2, 15, '2025-06-17 12:00:00', 'Red Vault', 'Room 2', '12:30', true, 150000, 50, 'B3'),
(3, 25, '2025-06-18 15:00:00', 'Big Blunder', 'Room 1', '15:30', true, 100000, 0, 'C5'),
(4, 10, '2025-06-18 18:00:00', 'Whispering Walls', 'Room 1', '18:30', true, 110000, 0, 'A2'),
(5, 30, '2025-06-19 21:00:00', 'Cosmic Dawn', 'Room 2', '21:30', true, 180000, 100, 'A4'),
(6, 20, '2025-06-19 09:00:00', 'Dragon’s Quest', 'Room 1', '09:30', true, 130000, 0, 'B1'),
(7, 15, '2025-06-20 12:00:00', 'Coastal Sparks', 'Room 1', '12:30', true, 110000, 0, 'C3'),
(8, 25, '2025-06-20 15:00:00', 'Temporal Rift', 'Room 1', '15:30', true, 160000, 50, 'A5'),
(9, 10, '2025-06-21 18:00:00', 'Mending Hearts', 'Room 3', '18:30', true, 140000, 0, 'A1'),
(10, 30, '2025-06-21 21:00:00', 'Eclipse of Fear', 'Room 2', '21:30', true, 120000, 0, 'B2'),
(11, 20, '2025-06-22 09:00:00', 'Polar Trek', 'Room 3', '09:30', true, 130000, 0, 'A3'),
(12, 15, '2025-06-22 12:00:00', 'Circuit Rebellion', 'Room 4', '12:30', true, 150000, 50, 'A4'),
(13, 25, '2025-06-17 15:00:00', 'Shadow Strike', 'Room 4', '15:30', true, 110000, 0, 'B5'),
(14, 10, '2025-06-18 18:00:00', 'Trip Trap', 'Room 4', '18:30', true, 100000, 0, 'C1'),
(15, 30, '2025-06-19 21:00:00', 'Love’s Journey', 'Room 3', '21:30', true, 140000, 100, 'A6'),
(16, 20, '2025-06-20 23:00:00', 'Relic’s Curse', 'Room 4', '23', true, 120000, 0, 'B3'),
(17, 15, '2025-06-21 09:00:00', 'Waves of Time', 'Room 1', '09:30', true, 130000, 0, 'A2'),
(18, 25, '2025-06-22 12:00:00', 'Scales of Truth', 'Room 2', '12:30', true, 150000, 0, 'C4'),
(19, 10, '2025-06-23 15:00:00', 'Rekindled Flame', 'Room 4', '15:30', true, 110000, 0, 'A1'),
(20, 20, '2025-06-23 18:00:00', 'Circuit Heart', 'Room 2', '18:30', true, 120000, 0, 'B5');