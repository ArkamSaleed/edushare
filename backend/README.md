# EduShare Backend

Backend server for EduShare file sharing platform using Azure Cosmos DB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your `.env` file with your Azure Cosmos DB credentials:
```
COSMOS_ENDPOINT=https://<your-account>.documents.azure.com:443/
COSMOS_KEY=<your-primary-key>
DATABASE_NAME=edushare
CONTAINER_NAME=users
PORT=3000
```

## Azure Cosmos DB Setup

1. Create a Cosmos DB account in Azure Portal
2. Create a database named `edushare`
3. Create a container named `users` with partition key `/type`
4. Copy your endpoint and primary key to the `.env` file

## Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
- **POST** `/api/auth/login`
- Body:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Health Check
- **GET** `/health`

## File Structure

```
backend/
├── db.js              # Cosmos DB connection
├── server.js          # Express server setup
├── routes/
│   └── auth.js        # Authentication routes
├── .env               # Environment variables
└── package.json       # Dependencies
```
