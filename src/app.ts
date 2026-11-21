import express from "express";
import { requestLogger } from "./middleware/requestLogger.js";
import { healthRouter } from "./features/health/health.router.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(requestLogger);

app.use("/health", healthRouter);

app.use(errorHandler);
