CREATE TABLE recipes(
    id INTEGER PRIMARY KEY,
    cuisine TEXT,
    title TEXT,
    rating FLOAT,
    prep_time INTEGER,
    cook_time INTEGER,
    total_time INTEGER,
    description TEXT,
    nutrients TEXT,
    serves TEXT
);