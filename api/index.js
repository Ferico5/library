import express from 'express';
import cors from 'cors';
import db from './config/Database.js';

// import Route
import UserRoute from './routes/UserRoute.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// route
app.use(UserRoute);

(async () => {
  try {
    await db.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.log(`Error syncing database:`, error);
  }
})();

app.listen(5000, () => {
  console.log(`Server is running in port ${port}`);
});
