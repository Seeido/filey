const EXPECTED_DB = "filey_test";

export function assertTestDb() {
  const raw = process.env.DB_URL; // reads DB_URL directly so config doesn't have to be loaded
  if (!raw) {
    throw new Error(
      "DB_URL is not set. Run tests via the npm scripts so .env.test is loaded.",
    );
  }
  const dbName = new URL(raw).pathname.slice(1); // ignores ?sslmode=...
  if (dbName !== EXPECTED_DB) {
    throw new Error(
      `refusing to run: DB_URL points at "${dbName}", expected "${EXPECTED_DB}".\nIs DB_URL exported in your shell? Shell variables override --env-file.`,
    );
  }
}

if (import.meta.main) {
  try {
    assertTestDb();
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}
