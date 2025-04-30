import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  
  // Método super-reforçado de criação
  static async safeCreate(values: any) {
    return await sequelize.transaction(async (t) => {
      try {
        const user = await this.create(values, { transaction: t });
        await t.commit();
        return user;
      } catch (error) {
        await t.rollback();
        console.error('Falha na transação:', error);
        throw error;
      }
    });
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  paranoid: false,
  hooks: {
    afterCreate: (user) => {
      console.log(`Usuário criado com ID: ${user.id}`);
    }
  }
});

export default User;