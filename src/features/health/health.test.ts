import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../app.js";
import { checkDatabaseHealth } from "./health.queries.js";

vi.mock("./health.queries.js", () => ({
  checkDatabaseHealth: vi.fn(),
}));

describe("GET /health", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 when the database is healthy", async () => {
    vi.mocked(checkDatabaseHealth).mockResolvedValue();

    const result = await request(app).get("/health");

    expect(result.status).toBe(200);
  });

  it("returns 503 when the database is unavailable", async () => {
    vi.mocked(checkDatabaseHealth).mockRejectedValue(new Error());

    const result = await request(app).get("/health");

    expect(result.status).toBe(503);
  });

  it("doesn't expose error details in the response", async () => {
    vi.mocked(checkDatabaseHealth).mockRejectedValue(
      new Error("SECRET_DB_DETAIL"),
    );

    const result = await request(app).get("/health");

    expect(result.text).toBe("");
    expect(JSON.stringify(result.headers)).not.toContain("SECRET_DB_DETAIL");
  });
});
