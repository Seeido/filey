type APIConfig = {
  port: number;
};
type DBConfig = {
  url: string;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
};

export const config: Config = {
  api: {
    port: parsePort(envOrThrow("PORT")),
  },
  db: {
    url: envOrThrow("DB_URL"),
  },
};

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`environment variable ${key} isn't available`);
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
