import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import indexRouter from "./index";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/", indexRouter);

export default app;
