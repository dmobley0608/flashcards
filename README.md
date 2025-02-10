
# Flashcards  Application

## Overview

This project is a flashcards web application that allows users to log in and manage their flashcards. The server utilizes GraphQL, and the web interface is built with Vite, React, React Router, and GraphQL.

## Technologies Used

### Server
- **GraphQL**: The server uses GraphQL for handling API requests and responses.

### Web Interface
- **Vite**: A fast build tool and development server for modern web projects.
- **React**: A JavaScript library for building user interfaces.
- **React Router**: A library for routing in React applications.
- **GraphQL**: Used on the client side to interact with the GraphQL server.

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/flashcards.git
   cd flashcards
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Application

1. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

### Folder Structure

```
flashcards/
├── server/                 # GraphQL server code
├── web/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # React pages
│   │   ├── Queries/        # GraphQL queries and mutations
│   │   ├── App.tsx         # Main app component
│   │   └── index.tsx       # Entry point
│   └── public/             # Public assets
├── package.json            # Project metadata and dependencies
└── README.md               # Project documentation
```


