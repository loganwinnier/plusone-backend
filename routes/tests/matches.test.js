// "use strict";

// const {
//     Data,
//     clearDb,
//     runBeforeAll,
//     createUser,
//     generateEvents,
//     generateMatches
// } = require("../../_testCommon");
// const request = require("supertest");
// const app = require("../../app");
// const { prisma } = require("../../prisma");



// describe("post match route", () => {
//     let adminToken,
//         existingUserToken,
//         existingUser,
//         testEvent,
//         existingAdmin
//             = null;

//     beforeAll(async () => {
//         ({
//             adminToken,
//             existingUserToken,
//             existingUser,
//             existingAdmin,
//         } = await runBeforeAll());
//         const testUser = await createUser(Data.testUser);
//         const event = await generateEvents(testUser, 1);
//         testEvent = event[0];

//     });

//     afterEach(async () => {
//         await prisma.match.deleteMany({});
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works user", async () => {
//         const data = { guestEmail: existingUser.email, eventId: testEvent.id };
//         const resp = await request(app)
//             .post("/matches")
//             .send({
//                 ...data
//             }).set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toMatchObject({
//             "match": {
//                 "event": {
//                     "geoLocation": [0.1234, 0.2345],
//                     "city": "new york",
//                     "state": "new york",
//                     "dateTime": expect.stringContaining(""),
//                     "description": "event description 1",
//                     "hostEmail": "test2@email.com",
//                     "id": expect.stringContaining(""),
//                     "payment": 0,
//                     "title": "event 1",
//                     "type": [],
//                 },
//                 "id": expect.stringContaining(""),
//                 "user": {
//                     "email": "test@email.com",
//                     "firstName": "Test",
//                     "isAdmin": false,
//                     "lastLogin": expect.stringContaining(""),
//                     "lastName": "User1",
//                     "phoneNumber": "1234567890",
//                 },
//             },
//         });
//     });

//     test("works admin", async () => {
//         const data = { guestEmail: existingUser.email, eventId: testEvent.id };
//         const resp = await request(app)
//             .post("/matches")
//             .send({
//                 ...data
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toMatchObject({
//             "match": {
//                 "event": {
//                     "geoLocation": [0.1234, 0.2345],
//                     "city": "new york",
//                     "state": "new york",
//                     "dateTime": expect.stringContaining(""),
//                     "description": "event description 1",
//                     "hostEmail": "test2@email.com",
//                     "id": expect.stringContaining(""),
//                     "payment": 0,
//                     "title": "event 1",
//                     "type": [],
//                 },
//                 "id": expect.stringContaining(""),
//                 "user": {
//                     "email": "test@email.com",
//                     "firstName": "Test",
//                     "isAdmin": false,
//                     "lastLogin": expect.stringContaining(""),
//                     "lastName": "User1",
//                     "phoneNumber": "1234567890",
//                 },
//             },
//         });
//     });

//     test("works user", async () => {
//         const data = { guestEmail: existingUser.email, eventId: testEvent.id };
//         const resp = await request(app)
//             .post("/matches")
//             .send({
//                 ...data
//             }).set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toMatchObject({
//             "match": {
//                 "event": {
//                     "dateTime": expect.stringContaining(""),
//                     "description": "event description 1",
//                     "hostEmail": "test2@email.com",
//                     "id": expect.stringContaining(""),
//                     "payment": 0,
//                     "title": "event 1",
//                     "type": [],
//                 },
//                 "id": expect.stringContaining(""),
//                 "user": {
//                     "email": "test@email.com",
//                     "firstName": "Test",
//                     "isAdmin": false,
//                     "lastLogin": expect.stringContaining(""),
//                     "lastName": "User1",
//                     "phoneNumber": "1234567890",
//                 },
//             },
//         });
//     });

//     test("fails non auth'd user", async () => {
//         const data = { guestEmail: existingAdmin.email, eventId: testEvent.id };
//         const resp = await request(app)
//             .post("/matches")
//             .send({
//                 ...data
//             }).set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toMatchObject({
//             error: ['Must be guest user or event host to perform match actions']
//         });
//     });
// });


// describe("post get all route", () => {
//     let
//         existingUser,
//         existingAdmin,
//         adminToken,
//         existingUserToken,
//         testUser,
//         events,
//         matches = null;

//     beforeAll(async () => {
//         ({
//             existingUser,
//             existingAdmin,
//             adminToken,
//             existingUserToken
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
//         const resp = await request(app)
//             .get("/matches")
//             .set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body.matches.length).toEqual(matches.length);
//     });

//     test("works min filter", async () => {
//         const min = 12;
//         const resp = await request(app)
//             .get("/matches")
//             .query(`min=${ min }`)
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(expect(resp.body.matches.length).toEqual(matches.length - min));
//     });

//     test("works max filter", async () => {
//         const max = 12;
//         const resp = await request(app)
//             .get("/matches")
//             .query(`max=${ max }`)
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(expect(resp.body.matches.length).toEqual(max));
//     });

//     test("works min and max filters", async () => {
//         const max = 12;
//         const min = 5;
//         const resp = await request(app)
//             .get("/matches")
//             .query(`max=${ max }&min=${ min }`)
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(expect(resp.body.matches.length).toEqual(max - min));
//     });
// });

// describe("delete match route", () => {
//     let adminToken,
//         existingUserToken,
//         existingEvent,
//         testUserToken,
//         existingMatch = null;

//     beforeAll(async () => {
//         ({
//             adminToken,
//             existingUserToken,
//             existingEvent,
//             testUserToken,
//             existingMatch
//         } = await runBeforeAll());
//     });

//     beforeEach(async () => {
//         try {
//             existingMatch = await prisma.match.create({
//                 data: { eventId: existingEvent.id, guestEmail: "admin@email.com" },
//             });
//         } catch (err) {
//             console.log("match still exists");
//         }
//     });

//     afterAll(async () => {
//         await clearDb();
//     });

//     test("works admin", async () => {
//         const resp = await request(app)
//             .delete(`/matches/${ existingMatch.id }`)
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({ deleted: existingMatch.id });
//     });

//     test("works same user", async () => {
//         const resp = await request(app)
//             .delete(`/matches/${ existingMatch.id }`)
//             .set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual({ deleted: existingMatch.id });
//     });

//     test("fails non admin and non auth'd user", async () => {
//         const resp = await request(app)
//             .delete(`/matches/${ existingMatch.id }`)
//             .set("authorization", `Bearer ${ testUserToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails signed out", async () => {
//         const resp = await request(app)
//             .delete(`/matches/${ existingMatch.id }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });
// });
