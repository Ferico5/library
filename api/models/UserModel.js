import { DataTypes, Model } from 'sequelize';
import db from '../config/Database.js';

class UserModel extends Model {}

UserModel.init(
  {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize: db,
    modelName: 'UserModel',
    tableName: 'user',
    freezeTableName: true,
  }
);

export default UserModel;
