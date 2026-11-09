import express from "express";
import { healthRouter } from "./features/health/health.router.js";

export const app = express();

app.use("/health", healthRouter);
