import { Sequelize } from 'sequelize';
import pg from 'pg';

// Configuração para o Neon
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  dialectModule: pg, // Usa o driver pg diretamente
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 3, // Conexões simultâneas (adequado para plano gratuito)
    min: 0,
    idle: 10000,
    acquire: 30000,
    evict: 10000 // Remove conexões ociosas
  },
  retry: {
    max: 3, // Tentativas de reconexão
    match: [/timeout/i, /ECONNRESET/]
  }
});

// Teste de conexão inicial
export const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com Neon estabelecida');
    
    if (process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
  await sequelize.sync({ alter: true });
}
      console.log('🔄 Modelos sincronizados (alter)');
    }
  } catch (error) {
    console.error('❌ Falha na inicialização do banco:', error);
    process.exit(1);
  }
};



export { sequelize };
