import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectSequelize } from "./config/db";
import UsersRouters from "./routes/UsersRoutes";
import AuthRoutes from "./routes/AuthRoutes"


dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectSequelize();

app.use((req, res, next) => {
  console.log(`Request recebido: ${req.method} ${req.url}`);
  next();
});

app.use("/users", UsersRouters);
app.use("/auth", AuthRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
