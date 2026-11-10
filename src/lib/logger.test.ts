import { describe, expect, it } from "vitest";
import { createLogger } from "./logger.js";
import { Writable } from "node:stream";

describe("logger redaction", () => {
  it("doesn't leak sensitive info", () => {
    const logs: string[] = [];
    const stream = new Writable({
      write(chunk, _encoding, callback) {
        logs.push(chunk.toString());
        callback();
      },
    });
    const logger = createLogger("info", stream);

    logger.info({
      req: {
        id: "69420",
        method: "GET",
        url: "/ballz",
        query: {},
        params: {},
        headers: {
          accept: "application/json, text/plain, */*",
          "user-agent": "bruno-runtime/4.3.0",
          authorization: "juicy authorization secret stuff",
          cookie: "yummy request cookies",
          "accept-encoding": "gzip, compress, deflate, br",
          host: "localhost:8080",
          connection: "keep-alive",
        },
        remoteAddress: "::1",
        remotePort: 55785,
      },
      res: {
        headers: {
          "set-cookie": "yummy response cookies",
        },
      },
    });

    expect(logs).toHaveLength(1);
    const raw = logs[0];
    const entry = JSON.parse(raw);

    expect(entry.req.headers.authorization).toBe("[Redacted]");
    expect(entry.req.headers.cookie).toBe("[Redacted]");
    expect(entry.res.headers["set-cookie"]).toBe("[Redacted]");

    expect(raw).not.toContain("juicy authorization secret stuff");
    expect(raw).not.toContain("yummy request cookies");
    expect(raw).not.toContain("yummy response cookies");
  });
});
