"use strict";
/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

// const { authenticateJWT } = require("./middleware/auth");
const CORS_OPTIONS = require("./config");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const eventsRoutes = require("./routes/events");
const likeRoutes = require("./routes/likes");
const chatsRoutes = require("./routes/chats");
const profilesRoutes = require("./routes/profiles");
const morgan = require("morgan");

const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("tiny"));
// app.use(authenticateJWT);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/events", eventsRoutes);
app.use("/likes", likeRoutes);
app.use("/chats", chatsRoutes);
app.use("/profiles", profilesRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;