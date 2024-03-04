// "use strict";

// const { Data, clearDb, runBeforeAll } = require("../../_testCommon");
// const { prisma } = require("../../prisma");
// const Event = require("../event");

// describe("Test Event creation", () => {
//     let existingUser = null;

//     beforeAll(async () => {
//         ({
//             existingUser,
//         } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works", async () => {
//         const event = await Event.create({ ...Data.testEvent, user: existingUser });

//         delete event.dateTime;
//         let eventData = Data.testEvent;
//         delete eventData.dateTime;
//         expect(event).toMatchObject(eventData);
//     });

//     test("fails incomplete data", () => {
//         expect(async () => await Event.create({
//             geoLocation: [0.1234, 0.2345],
//             city: "new york",
//             hostEmail: "test@email.com",
//             state: "new york",
//             description: "Test event test user 2 description",
//             type: [],
//             payment: null
//         }).toThrow("please fill out required fields"));
//     });

//     test("fails bad data", () => {
//         //invalid payment
//         expect(async () => await Event.create({
//             hostEmail: "test@email.com",
//             description: "Test event test user 2 description",
//             type: [],
//             payment: "Bad payment"
//         }).toThrow("please fill out required fields"));
//     });
// });

// describe("Test Event patch", () => {
//     let existingUser, existingAdmin, existingEvent, existingMatch = null;

//     beforeAll(async () => {
//         ({
//             existingUser,
//             existingAdmin,
//             existingEvent,
//             existingMatch
//         } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works", async () => {
//         const event = await Event.patch({
//             ...Data.testEvent,
//             user: existingUser
//         },
//             existingEvent.id);

//         delete event.dateTime;
//         let eventData = Data.testEvent;
//         delete eventData.dateTime;
//         expect(event).toMatchObject(eventData);
//     });

//     test("fails works bad data", () => {
//         //invalid payment
//         expect(async () => await Event.patch({
//             description: "Test event test user 2 description",
//             type: [],
//             payment: "bad payment "
//         }, existingEvent.id).toThrow("please fill out required fields"));
//     });

//     test("fails to find bad event id", async () => {
//         expect(async () => await Event.patch({
//             description: "Test event test user 2 description",
//             type: [],
//             payment: null
//         }, "not a id").toThrow("event not found."));
//     });

//     test("fails works incomplete data", () => {
//         expect(async () => await Event.patch({}).toThrow("please fill out required fields"));
//     });
// });