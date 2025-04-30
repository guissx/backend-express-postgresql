import { Sequelize } from 'sequelize';
import pg from 'pg';

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: console.log, // Ative para ver todas as queries
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    application_name: 'your-app-name' // Identificador no Neon
  },
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3,
    match: [
      /ECONNRESET/,
      /SequelizeConnectionError/,
      /Connection terminated unexpectedly/
    ]
  }
});

// Teste de conexão agressivo
sequelize.authenticate()
  .then(() => console.log('✅ Conexão estabelecida com sucesso'))
  .catch(err => {
    console.error('❌ Falha catastrófica na conexão:', err);
    process.exit(1);
  });

// Monitoramento de eventos
sequelize.addHook('afterConnect', (connection) => {
  console.log('Nova conexão estabelecida');
});

sequelize.addHook('afterDisconnect', (connection) => {
  console.warn('Conexão perdida!');
});

export { sequelize };