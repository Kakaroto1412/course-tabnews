import { Client } from "pg";

function createClient() {
  const mode = process.env.DATABASE_MODE ?? "local";

  //Production
  if (mode === "dvdmr") {
    return new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    });
  }

  // local DEV (no ssl)
  return new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "development" ? false : true,
  });
}

async function query(queryObject) {
  const client = createClient();

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

export default { query: query };
