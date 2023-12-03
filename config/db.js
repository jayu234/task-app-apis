import { Sequelize } from "sequelize";
import pg from 'pg';

import dotenv from "dotenv";
dotenv.config({ path: "config/config.env" });

export const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: false,
  ssl: true,
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true
    }
  }
});

export const connectToPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
