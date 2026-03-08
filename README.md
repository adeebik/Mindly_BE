# Mindly Backend

Mindly is a "Second Brain" application that helps you organize, store, and share your digital content effortlessly. This repository contains the backend API services.

## 🚀 Features

- **Brain Sharing**: Share your collection of content with others using a unique public link.
- **Secure Authentication**: Robust user authentication with JWT and secure password hashing (bcrypt).
- **Flexible Content Management**: Easily add and organize links from various platforms like Twitter (X), YouTube, and more.
- **Tagging System**: Organize your thoughts and links with a simple yet powerful tagging system.
- **Ownership Protection**: Built-in validation to ensure your data stays private and secure.

## 🛠️ Tech Stack

- **Node.js & Express**: Fast and minimalist web framework.
- **MongoDB & Mongoose**: Flexible NoSQL database for content storage.
- **TypeScript**: Type-safe development for better reliability.
- **JWT**: Secure session management.
- **Zod**: Schema validation for API requests.

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or a cloud instance)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Starts the development server with `tsx` and `nodemon`.
- `npm run build`: Compiles TypeScript to JavaScript in the `dist` folder.
- `npm start`: Runs the compiled application from the `dist` folder.
