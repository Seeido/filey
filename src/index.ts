import express from "express";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";

const app = express();

app.listen(config.api.port, () => {
  logger.info({ port: config.api.port }, "Server started");
});
