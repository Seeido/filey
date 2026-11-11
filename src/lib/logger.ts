import { pino, type DestinationStream, type LevelWithSilent } from "pino";
import { config } from "../config.js";

export function createLogger(
  level: LevelWithSilent,
  destination?: DestinationStream,
) {
  return pino(
    {
      level,
      redact: [
        // Covers credential-bearing headers for now, new fields should be added here and to the tests
        "req.headers.authorization",
        "req.headers.cookie",
        'res.headers["set-cookie"]',
      ],
    },
    destination,
  );
}

export const logger = createLogger(config.logging.level);
