// import { runner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowedMethods`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const { runner } = await import("node-pg-migrate");
    const defaultMigrationOptions = {
      dbClient,
      dir: join(process.cwd(), "infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
      dryRun: request.method === "GET",
    };
    const result = await runner(defaultMigrationOptions);

    if (request.method === "POST") {
      return response.status(result.length > 0 ? 201 : 200).json(result);
    }

    // GET
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
