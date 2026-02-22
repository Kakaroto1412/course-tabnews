import { Client } from "pg";

async function query(queryObject, values) {
  let client;
  try {
    client = await getNewClient();

    if (Array.isArray(values)) {
      return await client.query(queryObject, values);
    }

    return await client.query(queryObject);
  } finally {
    if (client) await client.end();
  }
}

async function getNewClient() {
  const client = new Client(getClientConfig());
  await client.connect();
  return client;
}

function normalizePem(pem = "") {
  const cleaned = pem.trim().replace(/^['"]|['"]$/g, "");
  return cleaned.includes("\\n") ? cleaned.replace(/\\n/g, "\n") : cleaned;
}

function getClientConfig() {
  const host = (process.env.POSTGRES_HOST || "")
    .trim()
    .replace(/^['"]|['"]$/g, ""); // remove aspas da Vercel

  const port = Number(process.env.POSTGRES_PORT ?? 5432);
  const user = (process.env.POSTGRES_USER || "").trim();
  const password = process.env.POSTGRES_PASSWORD; // pode ser string vazia se não houver senha
  const database = (process.env.POSTGRES_DB || "").trim();

  // validações que evitam erro obscuro do pg
  if (!host) throw new Error("POSTGRES_HOST não definido");
  if (!user) throw new Error("POSTGRES_USER não definido");
  if (!database) throw new Error("POSTGRES_DB não definido");
  if (password !== undefined && typeof password !== "string") {
    throw new Error("POSTGRES_PASSWORD precisa ser string");
  }

  const isNeon = host.includes(".neon.tech");

  if (isNeon) {
    const ca = normalizePem(process.env.POSTGRES_SSL_CA || "");
    return {
      host,
      port,
      user,
      password,
      database,
      ssl: ca ? { rejectUnauthorized: true, ca } : { rejectUnauthorized: true },
    };
  }

  // ✅ localhost / qualquer outro Postgres sem SSL obrigatório
  return {
    host,
    port,
    user,
    password,
    database,
  };
} // ⚠️ IMPORTANTE: manter EXACTAMENTE esse export (não quebrar o projeto)
const database = {
  query,
  getNewClient,
};

export default database;
export { query, getNewClient, database };
