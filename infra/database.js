import { Pool } from "pg";
const pool = new Pool();

async function query(query) {
  const results = await pool.query(query);
  return results;
}

export default query;
