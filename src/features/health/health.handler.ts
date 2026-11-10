import type { Request, Response } from "express";
import { checkDatabaseHealth } from "./health.queries.js";
import { withTimeoutMs } from "../../lib/timeout.js";

export async function getHealth(req: Request, res: Response) {
  try {
    await withTimeoutMs(checkDatabaseHealth(), 10 * 1000);
    return res.status(200).send();
  } catch (err) {
    req.log.error({ err }, "Database health check failed");
    res.status(503).send();
  }
}
