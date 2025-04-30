
import express, { Application } from "express";import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import { connectSequelize } from "../src/config/db";
import UsersRouters from "../src/routes/UsersRoutes";
import AuthRoutes from "../src/routes/AuthRoutes";

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());

connectSequelize();

app.use("/users", UsersRouters);
app.use("/auth", AuthRoutes);

export const handler = serverless(app);
