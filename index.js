import express from "express";
import initApp from "./src/app.router.js";
import dotenv from "dotenv";
import { customAlphabet } from "nanoid";
dotenv.config();
const app = express();
const port = process.env.PORT;

initApp(app, express);
app.listen(port, () => {
  console.log(`Server Is Running Port : ${port}`);
});
