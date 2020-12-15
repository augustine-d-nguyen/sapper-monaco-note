const functions = require('firebase-functions');
const { beastmaster } = require('./__sapper__/build/server/server');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.https.onRequest((request, response) => {
  // - Remove duplicated baseUrl.
  // - In case url rewriting by firebase hosting.
  request.url = request.url.replace(request.baseUrl.toString(), '');
  // - Send to beastmaster to handle.
  beastmaster(request, response);
});
