# Mindly Backend

Backend service for the Mindly application, built with Node.js and TypeScript.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Build Tool:** TypeScript Compiler

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (v14.x or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adeebik/Mindly_BE.git
cd Mindly_BE
```

2. Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=your_database_url

# Add other environment variables as needed
```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

## 💻 Development

### Available Scripts

- `npm run dev` - Run the application in development mode
- `npm run build` - Build the TypeScript code for production
- `npm start` - Run the compiled production code

## 🚢 Deployment

Instructions for deploying this application:

1. Build the project:
```bash
npm run build
```

2. Set up environment variables on your hosting platform

3. Deploy the `dist` folder to your hosting service (Heroku, AWS, DigitalOcean, etc.)

4. Start the application:
```bash
npm start
```

## 📁 Project Structure

```
Mindly_BE/
├── src/                  # Source files
│   ├── controllers/      # Route controllers
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── dist/                # Compiled output
├── .env                 # Environment variables (update before using)
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

**Note:** For more information or support, please open an issue on the GitHub repository.
