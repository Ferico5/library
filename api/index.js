const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// import Route
const userRoutes = require('./routes/UserRoute.js');
const bookRoutes = require('./routes/BookRoute.js');
const borrowedBookRoutes = require('./routes/BorrowedBookRoute.js');
const emailRoutes = require('./routes/EmailRoute.js');

const app = express();
const PORT = 8000;

const mongoDBURL = 'mongodb://127.0.0.1:27017/library';

mongoose
  .connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection Successful'))
  .catch((err) => console.error('Connection Error:', err));

app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.use(bookRoutes);
app.use(borrowedBookRoutes);
app.use(emailRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
