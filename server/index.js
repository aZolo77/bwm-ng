const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
// const config = require('./config/dev');

const FakeDb = require('./fake-db');
const path = require('path');

// = Routes
const rentalRoutes = require('./routes/rentals'),
  userRoutes = require('./routes/users'),
  bookingRoutes = require('./routes/bookings'),
  imageUploadRoutes = require('./routes/image-upload');

mongoose
  .connect(config.DB_URI)
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      const fakeDb = new FakeDb();
      // fakeDb.seedDb();
    }
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
app.use('/api/v1', imageUploadRoutes);

if (process.env.NODE_ENV === 'production') {
  // path to application
  const appPath = path.join(__dirname, '..', 'dist');
  // serving all static files inside app-folder
  app.use(express.static(appPath));
  // catching all other requests, that are not served by server and send them to app-main-file
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, (res, rej) => {
  console.log('Сервер запущен');
});
