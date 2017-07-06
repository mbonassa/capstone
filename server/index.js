const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const app = express();
// module.exports = app;
const MobileDetect = require('mobile-detect')
const md = new MobileDetect

// firebase cloud messaging routes

// let's bring our adminbot to life
const admin = require("firebase-admin");
let serviceAccount = require('../secrets.js');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://capstone-c9fe1.firebaseio.com"
});

module.exports = admin;

const createApp = () => app
  .use(morgan('dev'))
  .use(express.static(path.join(__dirname, '..', 'public')))
  .use(express.static(path.join(__dirname, '..', 'node_modules/bootstrap/dist')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .get('/messaging/newmatch/:tokenId', (req, res, next) => {
    let payload = {
      notification: {
        title: 'New Match',
        body: `You've got a match!`,
        color: 'pink',
        icon: 'http://i.imgur.com/GGMIIKS.png',
      },
      data: {
        whatever: 'you want!'
      }
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
