import { describe, expect, it } from "vitest";
import { parseLoggingLevel, parsePort } from "./config.js";

describe("parsePort()", () => {
  it.each(["1", "6942", "65535"])("returns %s as a number", (value) => {
    expect(parsePort(value)).toBe(Number(value));
  });

  it.each(["0", "-1", "65536", "1.5", "abc", "", " ", "Infinity", "NaN"])(
    "throws when given an invalid port: %s",
    (value) => {
      expect(() => parsePort(value)).toThrow(`${value} is not a valid port`);
    },
  );
});

describe("parseLoggingLevel()", () => {
  it.each([
    ["warn", "warn"],
    ["INFO", "info"],
    ["silent", "silent"],
    [" fatal ", "fatal"],
  ])("returns %s as %s", (input, expected) => {
    expect(parseLoggingLevel(input)).toBe(expected);
  });

  it.each(["wth", "bruv", "  "])(
    "throws when given an invalid log level: %s",
    (value) => {
      expect(() => parseLoggingLevel(value)).toThrow(
        `${value} is not a valid log level`,
      );
    },
  );
});
