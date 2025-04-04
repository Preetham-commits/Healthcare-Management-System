import express from 'express';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import { startStandaloneServer } from '@apollo/server/standalone';

dotenv.config();

const app = express();
const port = process.env.GATEWAY_PORT || 4007;

// List of services
const services = [
  { name: 'auth', url: 'http://localhost:4001/graphql' },
  { name: 'patient', url: 'http://localhost:4002/graphql' },
  { name: 'nurse', url: 'http://localhost:4003/graphql' },
  { name: 'emergency', url: 'http://localhost:4005/graphql' }
];

// Function to check service availability with retries
async function checkServiceAvailability(service, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(service.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ _service { sdl } }' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response was not JSON');
      }

      const data = await response.json();
      if (!data || !data.data || !data.data._service) {
        throw new Error('Invalid service response format');
      }

      return true;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed for ${service.name}: ${error.message}`);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
}

// Start server with error handling
async function startServer() {
  try {
    console.log('Checking service availability...');
    
    // Check all services
    const servicesStatus = await Promise.all(
      services.map(async (service) => {
        try {
          const isAvailable = await checkServiceAvailability(service);
          console.log(`Service ${service.name} is ${isAvailable ? '✅ available' : '❌ not available'}`);
          return { ...service, isAvailable };
        } catch (error) {
          console.error(`Error checking ${service.name}:`, error.message);
          return { ...service, isAvailable: false };
        }
      })
    );

    // Get available services
    const availableServices = servicesStatus.filter(s => s.isAvailable);
    
    if (availableServices.length === 0) {
      console.error('No services are available. Please start at least one service.');
      process.exit(1);
    }

    console.log(`Starting gateway with ${availableServices.length} available services...`);

    // Create Apollo Gateway with available services
    const gateway = new ApolloGateway({
      serviceList: [
        { name: 'nurse', url: 'http://localhost:4001/graphql' },
        { name: 'patient', url: 'http://localhost:4002/graphql' }
      ],
      debug: true
    });

    // Create Apollo Server
    const server = new ApolloServer({
      gateway,
      subscriptions: false
    });

    console.log('Starting Apollo Server...');
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4007 }
    });
    
    app.use(cors());
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server));

    app.listen(port, () => {
      console.log(`🚀 Gateway ready at ${url}`);
      console.log('Available services:', servicesStatus
        .map(s => `${s.name}: ${s.isAvailable ? '✅' : '❌'}`)
        .join(', '));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (error.message.includes('Couldn\'t load service definitions')) {
      console.error('This error usually means one or more services are not responding correctly.');
      console.error('Please check that all services are running and accessible.');
      console.error('You can test each service with:');
      console.error('curl -X POST http://localhost:PORT/graphql -H "Content-Type: application/json" -d \'{"query": "{ _service { sdl } }"}\'');
    }
    process.exit(1);
  }
}

startServer();
