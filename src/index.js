import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./router";
dotenv.config();
const app = express();

mongoose.connect(process.env.DB_HOST);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to:\x1b[33m ${db.name}\x1b[0m database`);
});
app.use(cors());
app.use(express.json());
app.use("/auth", router);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server is up and listening to port:\x1b[33m ${PORT}\x1b[0m`)
);
