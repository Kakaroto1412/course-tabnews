import database from "infra/database";

async function status(request, response) {
  await database.query("SHOW server_version;");
  // const responseBody = await response.json;

  const updatedAt = new Date().toISOString();
  console.log("timezone", updatedAt);

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );

  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpendConncetionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  console.log("DBname", databaseName);

  const databaseOpendConncetionsValue =
    databaseOpendConncetionsResult.rows[0].count;
  console.log("connctions", databaseOpendConncetionsValue);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: parseFloat(databaseVersionValue),
        max_connections: parseFloat(databaseMaxConnectionsValue),
        opened_connections: databaseOpendConncetionsValue,
      },
    },
  });
}

export default status;
