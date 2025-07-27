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

CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    movie_id VARCHAR(10) REFERENCES movie(movie_id),
    account_id INTEGER REFERENCES account(account_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE reward_point (
                              reward_id SERIAL PRIMARY KEY,
                              member_id INTEGER REFERENCES member(member_id),
                              points INTEGER NOT NULL,
                              reward_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Thêm tài khoản admin
INSERT INTO account (address, birthday, email, name, gender, identity_card, image, password, phone_number, register_date, status, username, role_id)
VALUES
    ('789 Admin St', '1990-01-01', 'admin@example.com', 'Admin User', 'MALE', '111222333', NULL, 'adminpass', '0900000000', '2024-01-03', true, 'admin', 4);

-- Thêm tài khoản employee
INSERT INTO account (address, birthday, email, name, gender, identity_card, image, password, phone_number, register_date, status, username, role_id)
VALUES
    ('456 Employee St', '1995-02-02', 'employee@example.com', 'Employee User', 'FEMALE', '444555666', NULL, 'employeepass', '0911111111', '2024-01-04', true, 'employee', 3);