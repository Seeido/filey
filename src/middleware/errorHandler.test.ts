import express from "express";
import { describe, expect, it } from "vitest";
import request from "supertest";
import { AppError } from "../lib/errors.js";
import { z } from "zod";
import { errorHandler } from "./errorHandler.js";

const testApp = express();
testApp.use(express.json());

testApp.get("/app-error", () => {
  throw new AppError("conflict", "Email is already in use");
});

testApp.get("/zod-error", () => {
  z.object({ email: z.string() }).parse({});
});

testApp.get("/unknown-error", () => {
  throw new Error("JUICY_SECRET_STUFF");
});

testApp.use(errorHandler);

describe("errorHandler", () => {
  it("returns 409 on a conflict", async () => {
    const res = await request(testApp).get("/app-error");
    expect(res.status).toBe(409);
    expect(res.body).toStrictEqual({ error: "Email is already in use" });
  });

  it("returns 400 on a validation/Zod error", async () => {
    const res = await request(testApp).get("/zod-error");
    expect(res.status).toBe(400);
    expect(res.body.fields.email).toBeDefined();
  });

  it("returns 400 on malformed json in the request", async () => {
    const res = await request(testApp)
      .post("/json")
      .set("Content-Type", "application/json")
      .send('{"bad"}');
    expect(res.status).toBe(400);
  });

  it("returns 500 and doesn't expose error details", async () => {
    const res = await request(testApp).get("/unknown-error");
    expect(res.status).toBe(500);
    expect(res.body).toStrictEqual({ error: "Internal Server Error" });
    expect(res.text).not.toContain("JUICY_SECRET_STUFF");
  });
});
