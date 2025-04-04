import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.AI_PORT || 4005;

// Connect to MongoDB
mongoose.connect(process.env.AI_MONGO_URI)
  .then(() => console.log('Connected to AI MongoDB'))
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

// Create Apollo Server with Federation
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: error.extensions
    };
  }
});

// Start server
async function startServer() {
  await server.start();

  // Apply middleware
  app.use('/graphql', expressMiddleware(server));

  app.listen(port, () => {
    console.log(`AI Service running at http://localhost:${port}/graphql`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 