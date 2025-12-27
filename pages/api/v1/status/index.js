import database from "infra/database";

async function status(request, response) {
  await database.query("SHOW server_version;");
  // const responseBody = await response.json;

  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  console.log(databaseVersionValue);

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  console.log(databaseMaxConnectionsResult);

  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpendConncetionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpendConncetionsValue =
    databaseOpendConncetionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpendConncetionsValue,
      },
    },
  });
}

export default status;
