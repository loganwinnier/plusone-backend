// "use strict";

// const { Data, clearDb, runBeforeAll, createUser, generateMatches, generateEvents } = require("../../_testCommon");
// const { prisma } = require("../../prisma");
// const Match = require("../match");
// const { NotFoundError, BadRequestError } = require("../../expressError");
// const { not } = require("joi");


// describe("Test Match creation", () => {
//     let existingUser, existingAdmin, existingEvent, existingMatch, testUser = null;

//     beforeAll(async () => {
//         ({
//             existingUser,
//             existingAdmin,
//             existingEvent,
//             existingMatch
//         } = await runBeforeAll(false));
//         testUser = await createUser(Data.testUser);
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works", async () => {
//         const match = await Match.create({
//             eventId: existingEvent.id,
//             guestEmail: testUser.email
//         },
//         );
//         expect(match).toMatchObject({});
//     });

//     test("fails incomplete data", () => {
//         expect(async () => await Match.create({
//             badKey: "blahh",
//         }).toThrow("email not found."));
//     });

//     test("fails incomplete data", () => {
//         expect(async () => await Match.create({
//             eventId: existingEvent.id,
//         }).toThrow("email not found."));
//     });

//     test("fails host is same as guest", async () => {
//         try {
//             await Match.create({
//                 eventId: existingEvent.id,
//                 guestEmail: existingUser.email,
//             });
//             expect(true).toBeFalsy();
//         } catch (err) {
//             expect(err).toBeInstanceOf(BadRequestError);
//         }
//     });

//     test("fails event does not exist", async () => {

//         try {
//             await Match.create({
//                 eventId: "bad event Id",
//                 guestEmail: testUser.email
//             });
//             expect(true).toBeFalsy();
//         } catch (err) {
//             expect(err).toBeInstanceOf(NotFoundError);
//         }
//     });

//     test("fails guest does not exist", async () => {

//         try {
//             await Match.create({
//                 eventId: existingEvent.id,
//                 guestEmail: "nonExisting"
//             });
//             expect(true).toBeFalsy();
//         } catch (err) {
//             expect(err).toBeInstanceOf(NotFoundError);
//         }
//     });
// });

// describe("Test Match getAll", () => {

//     let
//         existingUser,
//         existingAdmin,
//         existingEvent,
//         existingMatch,
//         testUser,
//         events,
//         matches = null;

//     beforeAll(async () => {
//         ({
//             existingUser,
//             existingAdmin,
//             existingEvent
//         } = await runBeforeAll(false));

//         testUser = await createUser(Data.testUser);

//         let eventUser = await createUser({
//             isAdmin: false,
//             email: "eventUser@email.com",
//             firstName: "Test",
//             lastName: "User1",
//             password: "password",
//             phoneNumber: null
//         });
//         events = await generateEvents(eventUser, 10);
//         matches = await generateMatches(
//             [testUser, existingAdmin, existingUser],
//             events);
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works", async () => {
//         const foundMatches = await Match.getAll();
//         expect(foundMatches.length).toEqual(matches.length);
//     });

//     test("gets from min", async () => {
//         const min = 20;
//         const foundMatches = await Match.getAll(min);
//         expect(foundMatches.length).not.toEqual(matches.length);
//         expect(foundMatches.length).toEqual(matches.length - min);
//     });

//     test("gets to max", async () => {
//         const max = 20;
//         const foundMatches = await Match.getAll(0, max);
//         expect(foundMatches.length).not.toEqual(matches.length);
//         expect(foundMatches.length).toEqual(max);
//     });

//     test("get between min and max", async () => {
//         const min = 10;
//         const max = 20;
//         const foundMatches = await Match.getAll(min, max);
//         expect(foundMatches.length).not.toEqual(matches.length);
//         expect(foundMatches.length).toEqual(max - min);
//     });

//     test("fails if min not integer", async () => {
//         try {
//             const max = 20;
//             await Match.getAll("not an int", max);
//             expect(true).toBeFalsy();
//         } catch (err) {
//             expect(err).toBeInstanceOf(BadRequestError);
//         }
//     });

//     test("fails if max not integer", async () => {
//         try {
//             const min = 20;
//             await Match.getAll(min, "not an int");
//             expect(true).toBeFalsy();
//         } catch (err) {
//             expect(err).toBeInstanceOf(BadRequestError);
//         }
//     });

// });