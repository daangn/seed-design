import { configDotenv } from "dotenv";

configDotenv();

export const ENV = {
  FIGMA_FILE_KEY: process.env.FIGMA_FILE_KEY,
  FIGMA_PERSONAL_ACCESS_TOKEN: process.env.FIGMA_PERSONAL_ACCESS_TOKEN,
};
