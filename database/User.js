import sequelize from 'sequelize';
import { conn } from './index.js';

const { DataTypes } = sequelize;

export default conn.define(
  'User',
  {
    openId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    sessionKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accessToken: {
      type: DataTypes.STRING,
      unique: true
    }
  },
  {
    timestamps: true
  }
);
