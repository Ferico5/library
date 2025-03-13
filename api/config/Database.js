import { Sequelize } from 'sequelize';

const db = new Sequelize('library', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
