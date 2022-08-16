'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Adds all bars which are in bars.json to the firebase database
 */
exports.updateBarsFromJson = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    const bars = require('./bars.json');
    var ref = admin.database().ref('bars');
    ref.set(bars);
    response.status(200).send('OK!');
  });
