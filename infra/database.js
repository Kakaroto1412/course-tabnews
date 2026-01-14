import { Client } from "pg";

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
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) return { ca: process.env.POSTGRES_CA };
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test")
    return false;
  return true;
}
