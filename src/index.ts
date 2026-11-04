import express from "express";
import { config } from "./config.js";

const app = express();

app.listen(config.api.port, () => {
  console.log(`Filey up and listening on port ${config.api.port}!`);
});
