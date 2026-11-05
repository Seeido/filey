import { app } from "./app.js";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";

app.listen(config.api.port, () => {
  logger.info({ port: config.api.port }, "Server started");
});
