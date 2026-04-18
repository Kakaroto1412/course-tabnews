import { join } from "node:path";
import database from "infra/database";

async function migrations(request, response) {
  const { runner } = await import("node-pg-migrate");

  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    });
  }


  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const result = await runner({
      dbClient,
      dir: join(process.cwd(), "infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
      dryRun: request.method === "GET",
    });

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
