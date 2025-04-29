import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

export const connectSequelize = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL conectado com sucesso!");
    
    // Sincroniza modelos (opcional - cuidado em produção)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
    }
  } catch (error) {
    console.error("❌ Erro ao conectar com o PostgreSQL:", error);
    process.exit(1);
  }
};

// Encerramento limpo
process.on("exit", () => {
  sequelize.close();
});