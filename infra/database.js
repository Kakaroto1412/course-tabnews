import { Client } from "pg";
import pkg from "pg";

const { Client } = pkg;

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    return await client.query(queryObject);
  } finally {
    if (client) await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  return client;
}

// function getSSLValues() {
//   if (process.env.POSTGRES_CA) {
//     return { ca: process.env.POSTGRES_CA, rejectUnauthorized: false };
//   }
//   return false;
// }
export default {
  query,
  getNewClient,
};
