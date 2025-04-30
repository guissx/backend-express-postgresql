// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectSequelize } from "./config/db";
import UsersRouters from "./routes/UsersRoutes";
import AuthRoutes from "./routes/AuthRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectSequelize();

app.use("/users", UsersRouters);
app.use("/auth", AuthRoutes);

export default app;
