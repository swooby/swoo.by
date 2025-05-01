/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const admin = require("firebase-admin");
const functions = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({origin: true}));

/*
function isEmulator() {
  return process.env.FUNCTIONS_EMULATOR ? true : false;
}
*/

/**
 * Log the request to the console and redirect to the new URL.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {string} to - The URL to redirect to.
 */
function logAndRedirect(req, res, to) {
  const VERBOSE_LOGGING = true;// isEmulator();
  const from = req.url;
  if (VERBOSE_LOGGING) {
    logger.info(`logAndRedirect: ip=${req.ip}, "${from}"->"${to}"`);
  }

  // TODO: Log this to firestore?
  // TODO: Log this to analytics...

  // https://expressjs.com/en/api.html#res.redirect
  // Always do 307!
  // 301 will be cached by the user browser and almost never expire. :/
  res.redirect(307, to);
}

/**
 * Initialize the redirects.
 */
function initializeRedirects() {
  const {redirects} = require("./redirects.js");
  // console.log("initializeRedirects: redirects=", redirects);
  for (const [to, from] of Object.entries(redirects)) {
    app.get(from, (req, res) => {
      logAndRedirect(req, res, to);
    });
  }
}

initializeRedirects();

exports.requestHandler = functions.https.onRequest(app);
