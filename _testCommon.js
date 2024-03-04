"use strict";

const { prisma } = require("./prisma");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("./config");
const moment = require('moment');
const User = require("./models/user");


/** File for common test data */

/** Common User data for testing*/
class Data {
    static existingUser = {
        isAdmin: false,
        email: "test@email.com",
        firstName: "Test",
        lastName: "User1",
        password: "password",
        phoneNumber: "1234567890"
    };

    static testUser = {
        isAdmin: false,
        email: "test2@email.com",
        firstName: "Test",
        lastName: "User1",
        password: "password",
        phoneNumber: "0987654321"
    };

    static existingAdmin = {
        isAdmin: true,
        email: "admin@email.com",
        firstName: "Admin",
        lastName: "User1",
        password: "password",
        phoneNumber: "12345678902"
    };

    static badUser = {
        email: "test_email.com",
        firstName: "Test#@$",
        lastName: "U",
        password: "pass",
        phoneNumber: "12345678"
    };

    static getDate(time = 6) {
        const now = moment.utc();
        const date = now.add(time, "M");
        return date;
    }

    static existingEvent = {
        hostEmail: "test@email.com",
        title: "Test event test user2",
        geoLocation: [0.1234, 0.2345],
        city: "new york",
        state: "new york",
        dateTime: Data.getDate(),
        description: "Test event test user 2 description",
        type: [],
        payment: null
    };

    static testEvent = {
        hostEmail: "test@email.com",
        title: "Test event test user2",
        state: "new york",
        dateTime: Data.getDate(),
        description: "Test event test user 2 description",
        type: [],
        payment: 1000,
        geoLocation: [0.1234, 0.2345],
        city: "new york",
    };

    static badEvent = {
        hostEmail: "test2user.com",
        title: "",
        geoLocation: [0.1234, 0.2345],
        city: "new york",
        state: "new york",
        dateTime: "BAD DATES",
        description: 200,
        type: "not an array",
        payment: "null"
    };

    static userProfile = {
        age: 1,
        bio: "I am a user profile",
        gender: "male",
        geoLocation: [0.1234, 0.2345],
        city: "new york",
        state: "new york",
    };

    static testProfile = {
        age: 12,
        bio: "I am a user profile",
        gender: "male",
        geoLocation: [0.1234, 0.2345],
        city: "new york",
        state: "new york",
    };

    static badProfile = {
        age: "twelve",
        bio: "I am a user profile",
        gender: true,
        geoLocation: [0.1234, 0.2345],
        city: "new york",
        state: "new york",
    };
};

async function createUser(data) {
    const dataCopy = { ...data };
    dataCopy.password = await bcrypt.hash(
        Data.existingUser.password,
        BCRYPT_WORK_FACTOR);

    const user = await prisma.user.create({ data: dataCopy });
    return user;
}

async function createEvent(data) {
    const dataCopy = { ...data };
    const event = await prisma.event.create({ data: dataCopy });
    return event;
}

async function createProfile(data) {
    const dataCopy = { ...data };
    const profile = await prisma.profile.create({ data: dataCopy });
    return profile;
}

/** Takes arrays of users and events, creates matches between them
 * 
 * return array of matches*/
async function generateMatches(users, events) {
    let event = 0;
    let matches = [];


    for (let user = 0; user < users.length; user++) {

        while (event < events.length) {
            try {
                let match = await prisma.match.create({
                    data: { eventId: events[event].id, guestEmail: users[user].email }
                });
                matches.push(match);
            } catch (err) {
                console.log("match already exists");
            }
            event++;
        }
        event = 0;
    }

    return matches;
}

/** Takes array of users  creates events for them 
 * 
 * return array of events*/
async function generateEvents(user, count = 10) {
    let events = [];

    for (let i = 0; i <= count; i++) {
        let event = await createEvent({
            title: `event ${ i + 1 }`,
            geoLocation: [0.1234, 0.2345],
            city: "new york",
            state: "new york",
            description: `event description ${ i + 1 }`,
            hostEmail: user.email,
            dateTime: Data.getDate(),
            type: [],
            payment: i
        });
        events.push(event);
    }

    return events;
}

async function runBeforeAll(match = true) {
    await clearDb();
    const existingUser = await createUser(Data.existingUser);
    const existingAdmin = await createUser(Data.existingAdmin);
    const existingEvent = await createEvent(Data.existingEvent);
    let existingMatch = null;

    if (match) {
        existingMatch = await prisma.match.create({
            data: { eventId: existingEvent.id, guestEmail: "admin@email.com" },

        });
    }
    const existingUserToken = User.createToken({
        email: Data.existingUser.email,
        isAdmin: false
    });
    const testUserToken = User.createToken({
        email: Data.testUser.email,
        isAdmin: false
    });
    const adminToken = User.createToken({
        email: Data.existingAdmin.email,
        isAdmin: true
    });

    return {
        existingUser,
        existingAdmin,
        existingEvent,
        existingMatch,
        existingUserToken,
        testUserToken,
        adminToken
    };
}

async function clearDb() {
    await prisma.match.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.user.deleteMany({});
}


module.exports = {
    Data,
    runBeforeAll,
    clearDb,
    createUser,
    createEvent,
    createProfile,
    generateMatches,
    generateEvents,
};