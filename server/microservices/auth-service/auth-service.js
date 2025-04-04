import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { schema } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const port = process.env.AUTH_PORT || 4001;

// Connect to MongoDB
mongoose.connect(process.env.AUTH_MONGO_URI)
  .then(() => console.log('✅ Connected to Auth MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  if (req.body && req.body.query) {
    console.log('📝 GraphQL Query:', req.body.query);
    console.log('📦 Variables:', req.body.variables);
  }
  next();
});

// Authentication middleware
const authMiddleware = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error('❌ Token verification error:', err);
    return null;
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: (error) => {
    console.error('❌ GraphQL Error:', {
      message: error.message,
      locations: error.locations,
      path: error.path,
      stack: error.stack
    });
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: error.extensions
    };
  },
  plugins: [
    {
      async requestDidStart() {
        return {
          async didResolveOperation(requestContext) {
            console.log('🔍 Operation:', requestContext.operationName);
            console.log('📝 Query:', requestContext.request.query);
            console.log('📦 Variables:', requestContext.request.variables);
          },
          async willSendResponse(requestContext) {
            console.log('📤 Response:', requestContext.response);
          },
        };
      },
    },
  ],
});

// Start server
async function startServer() {
  try {
    await server.start();
    console.log('✅ Apollo Server started');

    // Apply middleware
    app.use('/graphql', expressMiddleware(server, {
      context: async ({ req }) => {
        const user = await authMiddleware(req);
        return { user };
      }
    }));

    app.listen(port, () => {
      console.log(`✅ Auth Service running at http://localhost:${port}/graphql`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

startServer(); 