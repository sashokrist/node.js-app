# node.js-app

AReal Estate platform with features for managing:
- News articles
- Property listings with multiple images
- Renovation services with image upload
- User login
- Bootstrap 5 styling
- Admin panels and a public homepage

## 🔧 Features

- Node.js + Express backend
- EJS templating for views
- MySQL database integration
- File upload support via `multer`
- Fully styled using Bootstrap 5
- Modular structure: controllers, routes, views

---

## 📦 Installation Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/sashokrist/node.js-app.git
cd node.js-app

Install

npm install

npm start

Visit your app at: http://localhost:3000

Ensure your models/db.js is configured like this:

const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // no password if empty
  database: 'real_estate'
});
module.exports = pool;

Create database

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS real_estate;
USE real_estate;

-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS property_features;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS renovating_services;

CREATE TABLE `news` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `title` varchar(255) NOT NULL,
 `content` text NOT NULL,
 `image_url` varchar(255) NOT NULL,
 `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
 `image` varchar(255) DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
CREATE TABLE `properties` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `title` varchar(255) NOT NULL,
 `description` text DEFAULT NULL,
 `price` decimal(10,2) NOT NULL,
 `location` varchar(255) NOT NULL,
 `size` varchar(50) NOT NULL,
 `year_built` varchar(4) DEFAULT NULL,
 `image_url` varchar(255) NOT NULL,
 `bedrooms` int(11) NOT NULL,
 `bathrooms` int(11) NOT NULL,
 `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
CREATE TABLE `property_features` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `property_id` int(11) NOT NULL,
 `feature` varchar(255) NOT NULL,
 PRIMARY KEY (`id`),
 KEY `property_features_ibfk_1` (`property_id`),
 CONSTRAINT `property_features_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
CREATE TABLE `renovating_services` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `title` varchar(255) NOT NULL,
 `image_name` varchar(255) DEFAULT NULL,
 `description` text NOT NULL,
 `image_url` varchar(255) NOT NULL,
 `service_type` varchar(50) NOT NULL,
 `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
CREATE TABLE `renovations` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `service_name` varchar(255) NOT NULL,
 `description` text NOT NULL,
 `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
 `image_url` varchar(255) DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
users	CREATE TABLE `users` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `username` varchar(100) NOT NULL,
 `password` varchar(100) NOT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
