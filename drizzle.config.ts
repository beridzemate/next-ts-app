import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from a .env file
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

export default defineConfig({
  schema: "./src/drizzle/schema.ts", // Path to schema definition
  out: "./src/drizzle/migrations", // Path to migrations output
  dialect: "postgresql", // Database dialect
  strict: true, // Enable strict mode
  verbose: true, // Enable verbose logging
  dbCredentials: {
    url: process.env.DATABASE_URL as string, // Database URL from environment
  },
});
