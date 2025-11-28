-- Initialize PostgreSQL database for Crop Predictor

-- Create database
CREATE DATABASE crop_db;

-- Connect to crop_db
\c crop_db;

-- Create predictions table
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    user_id INT,
    crop_code INT NOT NULL,
    crop_label VARCHAR(100),
    n_level DECIMAL(10, 2),
    p_level DECIMAL(10, 2),
    k_level DECIMAL(10, 2),
    temperature DECIMAL(10, 2),
    humidity DECIMAL(10, 2),
    ph DECIMAL(10, 2),
    rainfall DECIMAL(10, 2),
    soil_moisture DECIMAL(10, 2),
    soil_type VARCHAR(50),
    sunlight_exposure VARCHAR(50),
    wind_speed DECIMAL(10, 2),
    co2_concentration DECIMAL(10, 2),
    organic_matter DECIMAL(10, 2),
    irrigation_frequency INT,
    crop_density DECIMAL(10, 2),
    pest_pressure INT,
    fertilizer_usage DECIMAL(10, 2),
    growth_stage VARCHAR(50),
    urban_area_proximity DECIMAL(10, 2),
    water_source_type VARCHAR(50),
    frost_risk VARCHAR(50),
    water_usage_efficiency DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (optional)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create crop_classes lookup table
CREATE TABLE crop_classes (
    code INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert crop classes (22 crops)
INSERT INTO crop_classes (code, name, description) VALUES
(0, 'Wheat', 'Cereal grain'),
(1, 'Rice', 'Staple grain'),
(2, 'Corn', 'Maize crop'),
(3, 'Barley', 'Grain crop'),
(4, 'Oats', 'Cereal grain'),
(5, 'Sorghum', 'Grain crop'),
(6, 'Millet', 'Small grain'),
(7, 'Cotton', 'Fiber crop'),
(8, 'Sugarcane', 'Sugar crop'),
(9, 'Peanuts', 'Oil crop'),
(10, 'Soybeans', 'Legume crop'),
(11, 'Sunflower', 'Oil crop'),
(12, 'Canola', 'Oil crop'),
(13, 'Potato', 'Root vegetable'),
(14, 'Tomato', 'Vegetable'),
(15, 'Pepper', 'Vegetable'),
(16, 'Onion', 'Bulb vegetable'),
(17, 'Garlic', 'Bulb crop'),
(18, 'Carrot', 'Root vegetable'),
(19, 'Lettuce', 'Leafy green'),
(20, 'Cabbage', 'Cruciferous vegetable'),
(21, 'Beans', 'Legume crop');

-- Create indexes
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_crop_code ON predictions(crop_code);
CREATE INDEX idx_predictions_created_at ON predictions(created_at);
CREATE INDEX idx_users_username ON users(username);
