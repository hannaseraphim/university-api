import * as dotenv from "dotenv";
dotenv.config();

interface EnvVariables {
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_PASSWORD: string;
  DATABASE_USER: string;
  DATABASE_NAME: string;
  FRONT_URL: string;
}

if (
  !process.env.SQL_HOST ||
  !process.env.SQL_PORT ||
  !process.env.SQL_USER ||
  !process.env.SQL_DATABASE
) {
  throw new Error(
    "Missing required environment variables for MySQL connection. Please check your '.env' file and make sure all SQL variables are there."
  );
}

const getEnvVariables = (): EnvVariables => {
  const envVariables: EnvVariables = {
    DATABASE_HOST: process.env.SQL_HOST || "",
    DATABASE_PORT: Number(process.env.SQL_PORT) || 3306,
    DATABASE_USER: process.env.SQL_USER || "",
    DATABASE_PASSWORD: process.env.SQL_PASS || "",
    DATABASE_NAME: process.env.SQL_DATABASE || "",
    FRONT_URL: process.env.SERVER_CORS || "",
  };

  return envVariables;
};

export const env = getEnvVariables();
