"use strict";

/** Prisma client instantiation  */

const { PrismaClient } = require('@prisma/client');
const { getDatabaseUri } = require('./config');

const db = getDatabaseUri();
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: db
        }
    }
}).$extends({
    result: {
        user: {
            chats: {
                compute(user) {
                    const chatsOne = user.chatsUserOne || [];
                    const chatsTwo = user.chatsUserTwo || [];
                    return chatsOne.concat(chatsTwo);
                }
            }
        }
    }
});
console.log("Prisma client instantiated");

module.exports = { prisma };