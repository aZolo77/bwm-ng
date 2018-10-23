const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/dev');

const FakeDb = require('./fake-db');

// = Routes
const rentalRoutes = require('./routes/rentals'),
  userRoutes = require('./routes/users'),
  bookingRoutes = require('./routes/bookings');

mongoose
  .connect(config.DB_URI)
  .then(() => {
    const fakeDb = new FakeDb();
    // fakeDb.seedDb();
  })
  .catch(err => {
    console.log(err);
  });

const app = express();

// = middelwear parsing json requests
app.use(bodyParser.json());

// = redirect routes
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);

app.listen(config.PORT, (res, rej) => {
  console.log(`Server is running on ${config.PORT} port`);
});
