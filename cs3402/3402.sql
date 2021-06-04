DROP TABLE ticket;
DROP TABLE house;
DROP TABLE client;
CREATE TABLE house (
    house_id NUMBER(10) PRIMARY KEY,
    house_name VARCHAR(1) NOT NULL
);
INSERT INTO house VALUES((SELECT COALESCE(MAX(house_id),0) FROM house)+1, 'A');
INSERT INTO house VALUES((SELECT COALESCE(MAX(house_id),0) FROM house)+1, 'B');
INSERT INTO house VALUES((SELECT COALESCE(MAX(house_id),0) FROM house)+1, 'C');
INSERT INTO house VALUES((SELECT COALESCE(MAX(house_id),0) FROM house)+1, 'D');
INSERT INTO house VALUES((SELECT COALESCE(MAX(house_id),0) FROM house)+1, 'E');
CREATE TABLE client (
    client_id NUMBER(10) PRIMARY KEY,
    client_email VARCHAR(100) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    CONSTRAINT check_client_email_unique UNIQUE (client_email)
);
CREATE TABLE ticket (
    ticket_id NUMBER(10) PRIMARY KEY,
    client_id NUMBER(10) NOT NULL,
    house_id NUMBER(10) NOT NULL,
    seat_no VARCHAR(2) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client(client_id),
    FOREIGN KEY (house_id) REFERENCES house(house_id),
    CONSTRAINT check_seat_no_format CHECK(REGEXP_LIKE(seat_no, '^[A-E][0-9]$')),
    CONSTRAINT check_seat_house_unique UNIQUE (seat_no,house_id)
);
commit;