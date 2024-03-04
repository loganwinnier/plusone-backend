"use strict";

/** Host server */
const app = require("./app");
const { PORT, CORS_OPTIONS } = require("./config");
const socketController = require("./socket");
const httpServer = require("http").createServer(app);
const io = require('socket.io')(httpServer, {
    cors: CORS_OPTIONS,
});

const chats = io.of('/chats');

console.log(app);
socketController(chats);

httpServer.listen(PORT, function () {
    console.log(`Started on http://localhost:${ PORT }`);
});


