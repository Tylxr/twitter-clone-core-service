import express from "express";
import cookieParser from "cookie-parser";
import models from "./models";
import routes from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Load models
models();

// Routes
app.use("/core/v1", routes);

export default app;
