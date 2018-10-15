const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/dev');

const Rental = require('./models/rental');
const FakeDb = require('./fake-db');

// = Routes
const rentalRoutes = require('./routes/rentals');

mongoose
  .connect(config.DB_URI)
  .then(() => {
    const fakeDb = new FakeDb();
    fakeDb.seedDb();
  })
  .catch(err => {
    console.log(err);
  });

const app = express();

app.use('/api/v1/rentals', rentalRoutes);

app.listen(config.PORT, (res, rej) => {
  console.log(`Server is running on ${config.PORT} port`);
});
