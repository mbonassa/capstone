const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const app = express();
// module.exports = app;
const MobileDetect = require('mobile-detect')


// let's bring our adminbot to life
const admin = require("firebase-admin");
const serviceAccount = require('../secrets.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://capstone-c9fe1.firebaseio.com"
});

module.exports = admin;

app.get('/test/:tokenId', (req, res, next) => {
  console.log("HI", req.params.tokenId)
  let payload = {
    notification: {message: "Hi!"},
    data: {tweet: 'very nice!'}
  };
  return admin.messaging().sendToDevice(req.params.tokenId, payload)
  .then(result => {
    console.log("Success!", result)
    res.sendStatus(200)
  })
  .catch(err => {
    console.log("Error :(", err)
  })
})


const createApp = () => app
  .use(morgan('dev'))
  .use(express.static(path.join(__dirname, '..', 'public')))
  .use(express.static(path.join(__dirname, '..', 'node_modules/bootstrap/dist')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // .use('/auth', require('./auth'))
  // .use('/api', require('./api'))
  .use((req, res, next) =>
    path.extname(req.path).length > 0 ? res.status(404).send('Not found') : next())
  .use('*', (req, res) =>
    res.sendFile(path.join(__dirname, '..', 'public/index.html')))
  .use((err, req, res, next) =>
    res.status(err.status || 500).send(err.message || 'Internal server error.'));

const listenUp = () =>
  app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`));

createApp(app);
listenUp();
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec

// if (require.main === module) {
//   store.sync()
//     .then(syncDb)
//     .then(createApp)
//     .then(listenUp);
// } else {
//   createApp(app);
// }
