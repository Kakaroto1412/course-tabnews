import { Client } from "pg";

async function getNewClient() {
  const client = new Client(getClientConfig());
  await client.connect();
  return client;
}

function getClientConfig() {
  // Produção (Vercel + Neon)
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // obrigatório para Neon + Vercel
    };
  }

  // Desenvolvimento local (Docker)
  return {
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: false,
  };
}
