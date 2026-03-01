// import { runner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  if (process.env.NODE_ENV === "production") {
    const expectedToken = process.env.MIGRATIONS_TOKEN;
    const receivedToken = request.headers["x-migrate-token"];

    if (!expectedToken || receivedToken !== expectedToken) {
      return response.status(404).json({ error: "Not found" });
    }
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const { runner } = await import("node-pg-migrate");
    const result = await runner({
      dbClient,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: process.env.NODE_ENV !== "production",
      migrationsTable: "pgmigrations",
      dryRun: request.method === "GET",
    });
    if (request.method === "POST") {
      return response.status(result.length > 0 ? 201 : 200).json(result);
    }

    return response.status(200).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      error: "Migration endpoint failed",
      details: error?.message ?? String(error),
    });
  } finally {
    if (dbClient) await dbClient.end();
  }
}

export default migrations;
