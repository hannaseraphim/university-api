import { env } from "../env.config.js";
import type { Connection } from "mysql2/promise";
import { createConnection } from "mysql2/promise";

// Database connection details
const connection: Connection = await createConnection({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
});

export default connection;
