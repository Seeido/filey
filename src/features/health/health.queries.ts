import { db } from "../../db/index.js";

export async function checkDatabaseHealth() {
  await db.execute("select 1");
}
