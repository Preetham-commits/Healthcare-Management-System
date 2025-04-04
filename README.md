# Healthcare Management System

A comprehensive healthcare management system built with React, Node.js, and GraphQL. This system provides separate interfaces for nurses and patients to manage healthcare-related tasks and information.

## Features

- **User Authentication**
  - Role-based access (Nurse/Patient)
  - Secure login and registration
  - JWT-based authentication

- **Nurse Dashboard**
  - Patient management
  - Medical conditions tracking
  - Clinical visits scheduling
  - Motivational tips management

- **Patient Dashboard**
  - Daily health information logging
  - Symptom tracking
  - View assigned nurse information
  - Access to motivational tips

## Tech Stack

- **Frontend**
  - React with TypeScript
  - Material-UI for components
  - Apollo Client for GraphQL
  - React Router for navigation

- **Backend**
  - Node.js with Express
  - GraphQL with Apollo Server
  - MongoDB for database
  - JWT for authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd healthcare-management-system
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../healthcareclient
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the server directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=4000
   ```

   - Create a `.env` file in the healthcareclient directory:
   ```
   REACT_APP_API_URL=http://localhost:4000
   ```

## Running the Application

1. Start the server:
```bash
cd server
npm start
```

2. Start the client:
```bash
cd healthcareclient
npm start
```

3. Access the application:
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000

## Project Structure

```
healthcare-management-system/
├── healthcareclient/          # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── graphql/          # GraphQL queries and mutations
│   │   └── context/          # React context providers
│   └── public/               # Static files
│
└── server/                   # Node.js backend
    ├── microservices/        # Microservices architecture
    │   └── auth-service/     # Authentication service
    │       ├── models/       # MongoDB models
    │       ├── graphql/      # GraphQL schema and resolvers
    │       └── config/       # Configuration files
    └── package.json
```

## Usage

1. **Registration**
   - Navigate to the registration page
   - Choose your role (Nurse/Patient)
   - Fill in your details
   - Submit the form

2. **Login**
   - Enter your email and password
   - You'll be redirected to your role-specific dashboard

3. **Nurse Features**
   - View and manage patients
   - Track medical conditions
   - Schedule clinical visits
   - Create motivational tips

4. **Patient Features**
   - Log daily health information
   - Track symptoms
   - View assigned nurse
   - Access motivational tips

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@healthcare-system.com or open an issue in the repository.
