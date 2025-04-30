import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDB } from "../src/config/db";
import UsersRouters from "../src/routes/UsersRoutes";
import AuthRoutes from "../src/routes/AuthRoutes";

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());

initializeDB();

app.use("/users", UsersRouters);
app.use("/auth", AuthRoutes);

// Não use app.listen, pois o Vercel cuida da execução.
export default app;
