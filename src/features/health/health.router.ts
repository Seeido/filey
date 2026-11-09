import express from "express";
import { getHealth } from "./health.handler.js";

export const healthRouter = express.Router();

healthRouter.get("/", getHealth);
