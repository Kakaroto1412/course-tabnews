import database from "infra/database.js";

async function status(request, respose) {
  const result = await database.query("SELECT 1 + 1 as sum;");
  console.log(result.rows);
  respose.status(200).json({ valor: "teste drive ^d~~" });
}

export default status;
