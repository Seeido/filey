import { defineConfig } from "drizzle-kit";
import { config } from "./src/config.js";

// drizzle-kit loads .env on its own, so vars not assigned in .env.test will get overwritten by .env automatically

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: config.db.url,
  },
});
