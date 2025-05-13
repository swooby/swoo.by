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

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({origin: true}));

/*
/**
 * Check if the functions are running in emulator mode.
 * @returns {boolean} - True if running in emulator, false otherwise.
 * /
function isEmulator() {
  return process.env.FUNCTIONS_EMULATOR ? true : false;
}
*/

/**
 * Quote a string (intended for logging).
 * @param {string} str - The string to quote.
 * @return {string|object} - The quoted string or str if str is not a string.
 */
function quote(str) {
  return typeof str === "string" ? `"${str}"` : str;
}

const axios = require("axios");

/**
 * Get geo information for a given IP address.
 * @param {string} ip - The IP address to look up.
 * @return {Object|null} - The geo information object or null if not found.
 */
async function getGeoInfo(ip) {
  if (!ip) {
    return null;
  }
  // Response from request `http://ip-api.com/json/50.47.223.0`:
  // {"status":"success",
  // "country":"United States",
  // "countryCode":"US",
  // "region":"WA",
  // "regionName":"Washington",
  // "city":"Kirkland",
  // "zip":"98034",
  // "lat":47.7229,
  // "lon":-122.1961,
  // "timezone":"America/Los_Angeles",
  // "isp":"Wholesail networks LLC",
  // "org":"Ziply Fiber",
  // "as":"AS20055 Wholesail networks LLC",
  // "query":"50.47.223.0"}
  const url = `http://ip-api.com/json/${ip}`;
  const response = await axios.get(url);
  return response.data; // Includes city, country, lat/lon
}

const geoCacheTimeout = 23 * 60 * 60 * 1000; // 23 hours
let geoCacheLastUpdated = Date.now();
const geoCache = new Map();

/**
 * Get cached geo information for a given IP address.
 * @param {string} ip - The IP address to look up.
 * @return {Object|null} - The geo information object or null if not found.
 */
async function getGeoInfoCached(ip) {
  const VERBOSE_LOGGING = false;// isEmulator();
  if (VERBOSE_LOGGING) {
    logger.debug(`getGeoInfoCached(ip=${quote(ip)})`);
  }
  if (!ip || ip === "127.0.0.1") {
    return null;
  }
  const now = Date.now();
  if (now - geoCacheLastUpdated > geoCacheTimeout) {
    logger.debug("getGeoInfoCached: geo cache expired; resetting...");
    geoCache.clear();
    geoCacheLastUpdated = now;
  }
  if (geoCache.has(ip)) {
    if (VERBOSE_LOGGING) {
      logger.debug("getGeoInfoCached: geo cache hit for ip=", ip);
    }
    return geoCache.get(ip);
  }
  if (VERBOSE_LOGGING) {
    logger.debug("getGeoInfoCached: geo cache miss for ip=", ip);
  }
  const geoInfo = await getGeoInfo(ip);
  geoCache.set(ip, geoInfo);
  return geoInfo;
}

/**
 * Get a friendly IP address from the request.
 * @param {*} req - The request object.
 * @return {string} - The IP address.
 */
async function getIpString(req) {
  const VERBOSE_LOGGING = false;// isEmulator();

  const xForwardedFor = req.get("x-forwarded-for");
  if (VERBOSE_LOGGING) {
    // logger.debug(`logAndRedirect: req=`, req);
    logger.debug(`logAndRedirect: req.get("x-forwarded-for")=` +
        `${quote(xForwardedFor)}`);
  }

  const remoteIp = xForwardedFor?.split(",")[0] || "127.0.0.1";
  const geoInfo = await getGeoInfoCached(remoteIp);
  if (VERBOSE_LOGGING) {
    logger.debug(`logAndRedirect: geoInfo[${remoteIp}]=`,
        JSON.stringify(geoInfo));
  }
  const geoString = geoInfo ? ` (${geoInfo.country}, ${geoInfo.city})` : "";
  const ipString = `${quote(remoteIp)}${geoString}`;
  return ipString;
}

/**
 * Log the request to the console and redirect to the new URL.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {string} to - The URL to redirect to.
 */
async function logAndRedirect(req, res, to) {
  const ipString = await getIpString(req);
  const from = req.url;
  logger.info(`logAndRedirect: ip=${ipString}, ${req.method} ${from} -> ${to}`);

  // TODO: Log this to firestore?
  // TODO: Log this to analytics...

  // https://expressjs.com/en/api.html#res.redirect
  // Always do 307!
  // 301 will be cached by the user browser and may never expire. :/
  res.redirect(307, to);
}

/**
 * Catch and log all unhandled requests.
 * @param {*} req
 * @param {*} res
 */
async function catchall(req, res) {
  const ipString = await getIpString(req);
  const from = req.url;
  logger.warn(`catchall: ip=${ipString}, Unhandled ${req.method} ${from}`);

  // TODO: Log this to firestore?

  res.status(404).send(`<!DOCTYPE html>
<html>
<body style="background:#000;color:#fff;font-family:monospace;">
Not Found
</body>
</html>`);
}

/**
 * Initialize the redirects.
 */
function initializeRedirects() {
  const {redirects} = require("./redirects.js");
  // console.log("initializeRedirects: redirects=", redirects);
  for (const [to, from] of Object.entries(redirects)) {
    app.get(from, async (req, res) => {
      await logAndRedirect(req, res, to);
    });
  }
}

initializeRedirects();

/**
 * Log unhandled requests; some common spam ones are:
 * * /robots.txt
 * * /__/hosting/verification
 * * /favicon.ico
 * * /wordpress/
 * * /.git/config
 * * /ads.txt
 */
app.all("/{*any}", catchall);

exports.requestHandler = functions.https.onRequest(
    {
      minInstances: 1,
    },
    app);
