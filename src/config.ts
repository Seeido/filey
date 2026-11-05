import { pino, type LevelWithSilent } from "pino";

type APIConfig = {
  port: number;
};
type DBConfig = {
  url: string;
};
type LoggingConfig = {
  level: LevelWithSilent;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
  logging: LoggingConfig;
};

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`environment variable ${key} isn't available`);
  }
  return value;
}

function envOrDefault(key: string, defaultValue: string) {
  const value = process.env[key];
  if (!value) {
    return defaultValue;
  }
  return value;
}

export function parsePort(port: string) {
  const parsed = Number(port);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`${port} is not a valid port`);
  }
  return parsed;
}

const logLevelNames = [...Object.keys(pino.levels.values), "silent"];
export function parseLoggingLevel(level: string): LoggingConfig["level"] {
  const normalizedLevel = level.toLowerCase().trim();
  if (!isLoggingLevel(normalizedLevel)) {
    throw new Error(`${level} is not a valid log level`);
  }
  return normalizedLevel;
}

function isLoggingLevel(level: string): level is LevelWithSilent {
  return logLevelNames.includes(level);
}

export const config: Config = {
  api: {
    port: parsePort(envOrThrow("PORT")),
  },
  db: {
    url: envOrThrow("DB_URL"),
  },
  logging: {
    level: parseLoggingLevel(envOrDefault("LOG_LEVEL", "info")),
  },
};
