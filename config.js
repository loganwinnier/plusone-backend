"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secretDedsadv";
const GEOCODING_KEY = process.env.GEOCODING_KEY;
const AWS_S3_ACCESS_KEY = process.env.AWS_S3_KEY;
const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;
const JWTOPTIONS = { expiresIn: '4d' };

const PORT = +process.env.PORT || 3001;

const CORS_OPTIONS = {
    origin: process.env.FRONT_END_URL
};

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL;
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

if (process.env.NODE_ENV !== "test") {
    console.log(`
${ "PlusOne Config:".green }
${ "NODE_ENV:".yellow }           ${ process.env.NODE_ENV }
${ "SECRET_KEY:".yellow }         ${ SECRET_KEY }
${ "PORT:".yellow }               ${ PORT }
${ "BCRYPT_WORK_FACTOR:".yellow } ${ BCRYPT_WORK_FACTOR }
${ "Database:".yellow }           ${ getDatabaseUri() }
---`);
}

module.exports = {
    JWTOPTIONS,
    CORS_OPTIONS,
    SECRET_KEY,
    PORT,
    GEOCODING_KEY,
    BCRYPT_WORK_FACTOR,
    AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY,
    BUCKET_NAME,
    getDatabaseUri,
};