import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { schema } from './graphql/schema.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.EMERGENCY_PORT || 4004;

// Connect to MongoDB
mongoose.connect(process.env.EMERGENCY_MONGO_URI)
  .then(() => console.log('Connected to Emergency MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authMiddleware = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

// Authorization middleware
const checkRole = (roles) => {
  return (user) => {
    if (!user) return false;
    return roles.includes(user.role);
  };
};

// Create Apollo Server
const server = new ApolloServer({
  schema,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: error.extensions
    };
  },
  context: ({ req }) => ({
    req
  })
});

// Start server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Emergency Service running at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 