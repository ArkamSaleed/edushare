require('dotenv').config();
const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});

const database = client.database(process.env.DATABASE_NAME);
const container = database.container(process.env.CONTAINER_NAME);

module.exports = container;
