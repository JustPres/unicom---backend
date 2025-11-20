# Uni-Backend Navigation Guide

This document provides a comprehensive guide to navigating and understanding the backend structure of the Uni-Backend project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [Project Structure](#project-structure)
5. [Key Components](#key-components)
6. [API Endpoints](#api-endpoints)
7. [Scripts](#scripts)

## Project Overview

This is a Node.js backend application built with Express.js and MongoDB (Mongoose). It handles user authentication, product management, quote generation, and PDF creation.

## Prerequisites

Ensure you have the following installed:
- Node.js
- MongoDB

## Installation & Setup

1.  **Install Dependencies**
    Run the following command to install the required packages:
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Ensure a `.env` file is present in the root directory with the following variables:
    - `PORT`: The port number for the server (default: 5000)
    - `MONGO_URI`: Connection string for your MongoDB database
    - `JWT_SECRET`: Secret key for signing JSON Web Tokens

## Project Structure

The project follows a standard MVC (Model-View-Controller) architectural pattern:

- **config/**: Contains configuration files, primarily for database connection (`db.js`).
- **controllers/**: Contains the logic for handling API requests.
    - `auth-controller.js`: Handles user registration and login.
    - `pdf-controller.js`: Manages PDF generation logic.
    - `product-controller.js`: Handles product CRUD operations.
    - `quote-controller.js`: Manages quote creation and retrieval.
- **middleware/**: Contains custom middleware functions.
    - `auth-middleware.js`: Verifies JWT tokens for protected routes.
- **models/**: Defines Mongoose schemas for database collections.
    - `product.js`: Schema for products.
    - `quotes.js`: Schema for quotes.
    - `user-model.js`: Schema for users.
- **routes/**: Defines the API route endpoints and maps them to controllers.
    - `auth.js`: Routes for authentication.
    - `product-routes.js`: Routes for product management.
    - `quote-routes.js`: Routes for quote management.
- **server.js**: The main entry point of the application. It initializes the Express app, connects to the database, applies middleware, and mounts routes.

## Key Components

### Authentication
User authentication is handled using JSON Web Tokens (JWT). The `auth-controller.js` manages registration and login, while `auth-middleware.js` protects routes that require authentication.

### Database
The application uses MongoDB with Mongoose for object modeling. Schemas are defined in the `models/` directory.

### PDF Generation
The application utilizes `pdfkit` for generating PDF documents, handled within `pdf-controller.js`.

## API Endpoints

The API is structured under the `/api` prefix:

### Authentication (`/api/auth`)
- **POST /register**: Register a new user.
- **POST /login**: Authenticate a user and return a token.

### Products (`/api/products`)
- Managed by `product-routes.js` and `product-controller.js`.
- Supports standard CRUD operations for products.

### Quotes (`/api/quotes`)
- Managed by `quote-routes.js` and `quote-controller.js`.
- Handles creation and retrieval of quotes.

## Scripts

The `package.json` file defines the following scripts:

- **`npm start`**: Runs the application using `node server.js`.
- **`npm run dev`**: Runs the application in development mode using `nodemon` for auto-reloading.
