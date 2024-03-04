// "use strict";

// const {
//     Data,
//     clearDb,
//     runBeforeAll,
//     createUser,
//     createEvent
// } = require("../../_testCommon");
// const request = require("supertest");
// const app = require("../../app");



// describe("post events route", () => {
//     let adminToken, existingUserToken, existingUser, existingAdmin = null;
//     const expectedResp = {
//         "event": {
//             "geoLocation": [0.1234, 0.2345],
//             "city": "new york",
//             "state": "new york",
//             "createdAt": expect.anything(),
//             "dateTime": expect.anything(),
//             "description": "Test event test user 2 description",
//             "hostEmail": expect.anything(),
//             "id": expect.anything(),
//             "payment": 1000,
//             "title": "Test event test user2",
//             "type": [],
//         }
//     };

//     beforeAll(async () => {
//         ({
//             adminToken,
//             existingUserToken,
//             existingUser,
//             existingAdmin
//         } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works admin", async () => {
//         const data = { ...Data.testEvent };
//         delete data.hostEmail;
//         const resp = await request(app)
//             .post("/events")
//             .send({
//                 ...data
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual(expectedResp);
//         expect(resp.body.event.hostEmail).toEqual(existingAdmin.email);
//     });

//     test("works user", async () => {
//         const data = { ...Data.testEvent };
//         delete data.hostEmail;
//         const resp = await request(app)
//             .post("/events")
//             .send({
//                 ...data
//             }).set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual(expectedResp);
//         expect(resp.body.event.hostEmail).toEqual(existingUser.email);
//     });

//     test("fails bad data", async () => {
//         const badData = { ...Data.testUser };
//         delete badData.password;
//         const resp = await request(app)
//             .post("/events")
//             .send({
//                 ...badData
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "isAdmin is not allowed",
//                 "email is not allowed",
//                 "firstName is not allowed",
//                 "lastName is not allowed",
//                 "phoneNumber is not allowed",
//             ],
//         });
//     });
// });


// describe("get events route", () => {
//     let adminToken, existingUserToken = null;
//     const expectedEvents = {
//         "events": [
//             {
//                 "geoLocation": [0.1234, 0.2345],
//                 "city": "new york",
//                 "state": "new york",
//                 "dateTime": expect.anything(),
//                 "description": "Test event test user 2 description",
//                 "hostEmail": "test@email.com",
//                 "id": expect.anything(),
//                 "payment": null,
//                 "title": "Test event test user2",
//                 "type": [],

//             }]
//     };

//     beforeAll(async () => {
//         ({
//             adminToken,
//             existingUserToken,
//         } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });

//     test("works admin", async () => {
//         const resp = await request(app)
//             .get("/events")
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual(expectedEvents);
//     });

//     test("works non admin", async () => {
//         const resp = await request(app)
//             .get("/events")
//             .set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual(expectedEvents);
//     });

//     test("fails signed out", async () => {
//         const resp = await request(app)
//             .get("/events");
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });
// });


// describe("get single events route", () => {
//     let adminToken, existingUserToken, existingEvent, testUserToken = null;
//     const expectedEvent = {
//         "event": {
//             "geoLocation": [0.1234, 0.2345],
//             "city": "new york",
//             "state": "new york",
//             "dateTime": expect.anything(),
//             "description": "Test event test user 2 description",
//             "hostEmail": "test@email.com",
//             "id": expect.anything(),
//             "payment": null,
//             "title": "Test event test user2",
//             "type": [],
//         }
//     };

//     beforeAll(async () => {
//         ({
//             adminToken,
//             existingUserToken,
//             testUserToken,
//             existingEvent
//         } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });

//     test("works admin", async () => {
//         const resp = await request(app)
//             .get(`/events/${ existingEvent.id }`)
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual(expectedEvent);
//     });

//     test("works same user", async () => {
//         const resp = await request(app)
//             .get(`/events/${ existingEvent.id }`)
//             .set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual(expectedEvent);
//     });

//     test("fails non admin and non posting user", async () => {
//         await createUser(Data.testUser);
//         const resp = await request(app)
//             .get(`/events/${ existingEvent.id }`)
//             .set("authorization", `Bearer ${ testUserToken }`);
//         expect(resp.body).toEqual(expectedEvent);
//     });

//     test("fails signed out", async () => {
//         const resp = await request(app)
//             .get(`/events/${ existingEvent.id }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });
// });


// describe("patch events route", () => {
//     let adminToken,
//         existingUserToken,
//         existingUser,
//         existingAdmin,
//         existingEvent,
//         testUserToken = null;

//     const expectedResp = {
//         "event": {
//             "geoLocation": [0.1234, 0.2345],
//             "city": "new york",
//             "state": "new york",
//             "dateTime": expect.anything(),
//             "description": expect.anything(),
//             "hostEmail": expect.anything(),
//             "id": expect.anything(),
//             "payment": null,
//             "title": "Test event test user2",
//             "type": [],
//         }
//     };

//     beforeAll(async () => {
//         ({
//             adminToken,
//             existingUserToken,
//             existingUser,
//             existingAdmin,
//             existingEvent,
//             testUserToken
//         } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works admin", async () => {
//         const data = { ...Data.testEvent };
//         delete data.hostEmail;
//         const resp = await request(app)
//             .patch(`/events/${ existingEvent.id }`)
//             .send({
//                 description: "best event ever"
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual(expectedResp);
//         expect(resp.body.event.description).toEqual("best event ever");
//     });

//     test("works auth'd user", async () => {
//         const data = { ...Data.testEvent };
//         delete data.hostEmail;
//         const resp = await request(app)
//             .patch(`/events/${ existingEvent.id }`)
//             .send({
//                 description: "best event ever"
//             }).set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual(expectedResp);
//         expect(resp.body.event.description).toEqual("best event ever");
//     });

//     test("fails not signed in", async () => {
//         const data = { ...Data.testEvent };
//         delete data.hostEmail;
//         const resp = await request(app)
//             .patch(`/events/${ existingEvent.id }`)
//             .send({
//                 description: "blah blah"
//             }).set("authorization", `Bearer ${ testUserToken }`);
//         expect(resp.body).toEqual({
//             "error": ["Failed to authenticate user."],
//         });
//     });

//     test("fails not signed in", async () => {
//         const data = { ...Data.testEvent };
//         delete data.hostEmail;
//         const resp = await request(app)
//             .patch(`/events/${ existingEvent.id }`)
//             .send({
//                 description: "blah blah"
//             });
//         expect(resp.body).toEqual({
//             "error": ["Failed to authenticate user."],
//         });
//     });

//     test("fails bad data", async () => {
//         const badData = { ...Data.testUser };
//         delete badData.password;
//         const resp = await request(app)
//             .patch(`/events/${ existingEvent.id }`)
//             .send({
//                 ...badData
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "isAdmin is not allowed",
//                 "email is not allowed",
//                 "firstName is not allowed",
//                 "lastName is not allowed",
//                 "phoneNumber is not allowed",
//             ],
//         });
//     });
// });


// describe("delete event route", () => {
//     let adminToken, existingUserToken, existingEvent, testUserToken = null;

//     beforeAll(async () => {
//         ({
//             existingEvent,
//             adminToken,
//             existingUserToken,
//             testUserToken
//         } = await runBeforeAll());
//     });

//     beforeEach(async () => {
//         try {
//             existingEvent = await createEvent(Data.existingEvent);
//         } catch {
//             console.log("Event still exists");
//         }
//     });

//     afterAll(async () => {
//         await clearDb();
//     });

//     test("works admin", async () => {
//         const resp = await request(app)
//             .delete(`/events/${ existingEvent.id }`)
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({ deleted: existingEvent.id });
//     });

//     test("works same user", async () => {
//         const resp = await request(app)
//             .delete(`/events/${ existingEvent.id }`)
//             .set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual({ deleted: existingEvent.id });
//     });

//     test("fails non admin and non auth'd user", async () => {
//         const resp = await request(app)
//             .delete(`/events/${ existingEvent.id }`)
//             .set("authorization", `Bearer ${ testUserToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails signed out", async () => {
//         const resp = await request(app)
//             .delete(`/events/${ existingEvent.id }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });
// });