import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import cors from 'cors';
import { schema } from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PATIENT_SERVICE_PORT || 4002;

// Connect to MongoDB
mongoose.connect(process.env.PATIENT_MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Create Apollo Server
const server = new ApolloServer({
  schema,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  }
});

// Start server
await server.start();

// Apply middleware
app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => {
    // Get the user token from the headers
    const token = req.headers.authorization || '';
    
    // Add the token to the context
    return { token };
  }
}));

app.listen(PORT, () => {
  console.log(`Patient service running on port ${PORT}`);
}); 