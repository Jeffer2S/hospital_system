import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3001,
  MASTER_DB: {
    HOST: process.env.MASTER_DB_HOST || "localhost",
    PORT: parseInt(process.env.MASTER_DB_PORT || "3307"),
    USER: process.env.MASTER_DB_USER || "root",
    PASSWORD: process.env.MASTER_DB_PASSWORD || "rootpass",
    NAME: process.env.MASTER_DB_NAME || "Medical_Center",
  },
  SLAVE_DB: {
    HOST: process.env.SLAVE_DB_HOST || "localhost",
    PORT: parseInt(process.env.SLAVE_DB_PORT || "3308"),
    USER: process.env.SLAVE_DB_USER || "admin",
    PASSWORD: process.env.SLAVE_DB_PASSWORD || "adminpass",
    NAME: process.env.SLAVE_DB_NAME || "Medical_Center",
  },
  JWT_SECRET: process.env.JWT_SECRET,
};
