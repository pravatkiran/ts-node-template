# TS Node Template

A boilerplate project for building REST APIs using **TypeScript**, **Express.js**, and **MongoDB**.

## Features

- **TypeScript** for type safety and modern JavaScript features.
- **Express.js** for creating robust REST APIs.
- **MongoDB** as the database.
- Preconfigured **ESLint** for code linting and quality checks.
- Scripted workflows for **development**, **building**, and **linting**.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** (v10 or later)
- **MongoDB** (local or cloud instance)

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ts-node-template.git
   cd ts-node-template
   ```
2. **Install dependencies
   ```bash
   npm install
   ```
## Scripts

1. **Run the project locally
   ```bash
   npm run dev
   ```
   Starts the development server with hot-reloading for local development.

2. **Build the project
   ```bash
   npm run build
   ```
   Compiles the TypeScript code into JavaScript and outputs it to the dist folder.

3. **Run linting
   ```bash
   npm run lint
   ```
   Checks the codebase for linting errors using ESLint.

## Environment Variables 
   The application uses environment variables to configure the application. Create a .env file in the root of your project with the following variables:
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/your-database
   TOKEN_SECRET=Your_secret

   Replace your-database with your actual MongoDB database name or connection string and Your_secret for secrets used for bcrypt.

## Contribution
   Feel free to fork this repository, make changes, and submit pull requests. Contributions are always welcome!




