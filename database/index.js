import { Sequelize } from 'sequelize';
import { DB } from '../config/index.js';

export const conn = new Sequelize(DB.NAME, DB.USERNAME, DB.PASSWORD, {
  host: DB.HOST,
  dialect: 'mysql',
  logging: console.log,
  timezone: '+08:00'
});

conn
  .authenticate()
  .then(() => {
    console.log('Ok');
  })
  .catch((error) => {
    console.error(error);
  });
