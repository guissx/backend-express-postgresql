import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Configuração otimizada para serverless
const createSequelizeInstance = () => {
  return new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 5,  // Ajuste conforme seu plano Neon
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
};

// Singleton para reutilizar a conexão
let sequelizeInstance: Sequelize;

export const getSequelize = () => {
  if (!sequelizeInstance) {
    sequelizeInstance = createSequelizeInstance();
  }
  return sequelizeInstance;
};

export const connectSequelize = async (): Promise<Sequelize> => {
  const sequelize = getSequelize();
  
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL conectado com sucesso!");
    
    // Sincronização apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log("🔁 Modelos sincronizados");
    }
    
    return sequelize;
  } catch (error) {
    console.error("❌ Erro ao conectar com o PostgreSQL:", error);
    throw error; // Propaga o erro para ser tratado pelo chamador
  }
};