import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app.js";

describe("requestLogger", () => {
  it("adds a UUID X-Request-Id to every response", async () => {
    const response = await request(app).get("/doesnt-exist");
    expect(response.status).toBe(404);

    expect(response.headers["x-request-id"]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it("generates a unique ID for every request", async () => {
    const response1 = await request(app).get("/does-not-exist");
    const response2 = await request(app).get("/does-not-exist");

    const id1 = response1.headers["x-request-id"];
    const id2 = response2.headers["x-request-id"];

    expect(id1).not.toBe(id2);
  });
});
