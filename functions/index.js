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

const axios = require("axios");

/**
 * Check if the functions are running in emulator mode.
 * @return {boolean} - True if running in emulator, false otherwise.
 */
function isEmulator() {
  return process.env.FUNCTIONS_EMULATOR ? true : false;
}

/**
 * Quote a string (intended for logging).
 * @param {string} str - The string to quote.
 * @return {string|object} - The quoted string or str if str is not a string.
 */
function quote(str) {
  return typeof str === "string" ? `"${str}"` : str;
}

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
async function getRequestIp(req) {
  const VERBOSE_LOGGING = false;// isEmulator();

  const xForwardedFor = req.get("x-forwarded-for");
  if (VERBOSE_LOGGING) {
    // logger.debug(`logAndRedirect: req=`, req);
    logger.debug(`getRequestIp: req.get("x-forwarded-for")=` +
        `${quote(xForwardedFor)}`);
  }

  const remoteIp = xForwardedFor?.split(",")[0] || "127.0.0.1";
  const geoInfo = await getGeoInfoCached(remoteIp);
  if (VERBOSE_LOGGING) {
    logger.debug(`getRequestIp: geoInfo[${remoteIp}]=`,
        JSON.stringify(geoInfo));
  }
  const geoString = geoInfo ? ` (${geoInfo.country}, ${geoInfo.city})` : "";
  const ipString = `${remoteIp}${geoString}`;
  return {ip: remoteIp, ipString};
}

/**
 * Remove the trailing slash from a URL if it exists.
 * @param {string} url - The URL to process.
 * @return {string} - The URL without the trailing slash.
 */
function removeTrailingSlash(url) {
  return url.replace(/\/$/, "");
}

/**
 * Log the request to the console and redirect to the new URL.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {string} to - The URL to redirect to.
 */
async function logAndRedirect(req, res, to) {
  const {ipString} = await getRequestIp(req);
  const from = removeTrailingSlash(req.url);
  logger.info(`logAndRedirect: ip=${ipString}, ${req.method} ${from} -> ${to}`);

  // TODO: Log this to firestore?

  // Client side redirect; shows well on Analytics dashboard
  const measurementId = "G-3FMC11TXNR";
  const title = `Redirect to ${JSON.stringify(to)}…`;
  const userId = JSON.stringify(ipString);
  const redirectTo = JSON.stringify(to);
  res.set("Content-Type", "text/html");
  res.status(200).send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>${title}</title>
    <!--
    https://developers.google.com/tag-platform/gtagjs#add_the_google_tag_to_your_website
    -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        //'page_title': window.location.href,
        //'page_location': window.location.href,
        user_id: ${userId},
        // https://support.google.com/analytics/answer/7201382?hl=en&utm_id=ad#zippy=%2Cgoogle-tag-gtagjs
        // "setting the parameter to false doesn't disable debug mode"
        // 'debug_mode': ${isEmulator()}, 
      });
    </script>
    <script>
      var redirectTo = ${redirectTo};
      gtag('event', 'redirect', {
        to: redirectTo,
        transport_type: 'beacon',
        event_callback: function() {
          window.location.replace(redirectTo);
        },
        //event_timeout: 2000
      });
    </script>
  </head>
  <body style="background:#000;color:#fff;font-family:monospace,monospace;">
    <p>${title}</p>
  </body>
</html>
`);
}

/**
 * Catch and log all unhandled requests.
 * @param {*} req
 * @param {*} res
 */
async function catchall(req, res) {
  const {ipString} = await getRequestIp(req);
  const from = req.url;
  logger.warn(`catchall: ip=${ipString}, Unhandled ${req.method} ${from}`);

  // TODO: Log this to firestore?

  res.status(404).send(`<!DOCTYPE html>
<html>
<body style="background:#000;color:#fff;font-family:monospace,monospace;">
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
