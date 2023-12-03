import app from "./app.js";

import dotenv from "dotenv";
dotenv.config({ path: "config/config.env" });

import { connectToPostgres, sequelize } from "./config/db.js";
connectToPostgres();

app.get("/", (_, res) => {
  res.status(200).send("Hello world!!");
});

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.HOST}:${process.env.PORT}`);
  });
});
