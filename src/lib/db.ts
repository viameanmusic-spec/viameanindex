import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _pool: mysql.Pool | undefined;
}

export const db =
  global._pool ??
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "viamean",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "viamean_site",
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4_turkish_ci",
  });

if (process.env.NODE_ENV !== "production") global._pool = db;
