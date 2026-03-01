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

const clean = (v = "") => v.trim().replace(/^['"]|['"]$/g, "");

function normalizePem(pem = "") {
  const cleaned = clean(pem);
  return cleaned.includes("\\n") ? cleaned.replace(/\\n/g, "\n") : cleaned;
}

function getClientConfig() {
  const host = clean(process.env.POSTGRES_HOST || "");

  const portRaw = (process.env.POSTGRES_PORT ?? "5432").toString().trim();
  const port = Number(portRaw);
  if (!Number.isInteger(port) || port <= 0) throw new Error("POSTGRES_PORT inválido");

  const user = clean(process.env.POSTGRES_USER || "");
  const database = clean(process.env.POSTGRES_DB || "");
  const password =
    process.env.POSTGRES_PASSWORD === undefined
      ? undefined
      : clean(process.env.POSTGRES_PASSWORD);

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


  return { host, port, user, password, database };
}


const database = { query, getNewClient };

export default database;
export { query, getNewClient, database };