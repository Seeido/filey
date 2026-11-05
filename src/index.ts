import { app } from "./app.js";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";

app.listen(config.api.port, (error) => {
  if (error) {
    logger.fatal({ err: error }, "Failed to start server");
    process.exit(1);
  }
  logger.info({ port: config.api.port }, "Server started");
});
