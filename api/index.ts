import express from "express";
import cors from "cors";
import { connectSequelize } from "../src/config/db";
import UsersRouters from "../src/routes/UsersRoutes";
import AuthRoutes from "../src/routes/AuthRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectSequelize();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/users", UsersRouters);
app.use("/auth", AuthRoutes);


export default app;