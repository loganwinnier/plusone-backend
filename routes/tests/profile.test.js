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
// const { createProfile } = require("../../models/user");



// describe("post profile route", () => {
//     let adminToken, existingUserToken, existingUser, existingAdmin = null;
//     const expectedResp = {
//         "profile": {
//             "geoLocation": [0.1234, 0.2345],
//             "city": "new york",
//             "state": "new york",
//             "age": 1,
//             "bio": "I am a user profile",
//             "email": "test@email.com",
//             "gender": "male",
//             "user": {
//                 "email": "test@email.com",
//                 "firstName": "Test",
//                 "isAdmin": false,
//                 "lastName": "User1",
//                 "phoneNumber": "1234567890",
//             }
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


//     test("works user", async () => {
//         const data = { ...Data.userProfile };
//         const resp = await request(app)
//             .post("/profiles")
//             .send({
//                 ...data
//             }).set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual(expectedResp);
//     });

//     test("fails bad data", async () => {
//         const badData = { ...Data.badProfile };
//         const resp = await request(app)
//             .post("/profiles")
//             .send({
//                 ...badData
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "age must be a number",
//                 "gender must be a string",
//             ],
//         });
//     });
// });

// describe("patch users route", () => {
//     let adminToken, existingUserToken, testUserToken, existingUser = null;
//     const expectedResp = {
//         "profile": {
//             "geoLocation": [0.1234, 0.2345],
//             "city": "new york",
//             "state": "new york",
//             "age": expect.anything(),
//             "bio": expect.anything(),
//             "email": "test@email.com",
//             "gender": "male",
//             "user": {
//                 "email": "test@email.com",
//                 "firstName": "New Name",
//                 "firstName": "Test",
//                 "isAdmin": false,
//                 "lastName": "User1",
//                 "phoneNumber": "1234567890",
//             }
//         }
//     };

//     beforeAll(async () => {
//         ({
//             existingUser,
//             testUserToken,
//             adminToken,
//             existingUserToken,
//         } = await runBeforeAll());
//         existingUser.lastLogin = "some time";
//         await createProfile({ ...Data.userProfile, email: existingUser.email });
//     });

//     beforeEach(async () => {
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works admin", async () => {
//         const resp = await request(app)
//             .patch(`/profiles/${ existingUser.email }`)
//             .send({
//                 bio: "I like biology"
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual(expectedResp);
//         expect(resp.body.profile.bio).toEqual("I like biology");

//     });

//     test("works correct user", async () => {
//         const resp = await request(app)
//             .patch(`/profiles/${ existingUser.email }`)
//             .send({
//                 age: 20
//             }).set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual(expectedResp);
//         expect(resp.body.profile.age).toEqual(20);
//     });

//     test("fails non admin and non auth'd user", async () => {
//         const resp = await request(app)
//             .patch(`/profiles/${ existingUser.email }`)
//             .send({
//                 ...Data.testUser
//             })
//             .set("authorization", `Bearer ${ testUserToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails not logged in", async () => {
//         const resp = await request(app)
//             .patch(`/profiles/${ existingUser.email }`)
//             .send({
//                 ...Data.testUser
//             });
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails bad data", async () => {
//         const badData = { age: "not age", gender: false };
//         const resp = await request(app)
//             .patch(`/profiles/${ existingUser.email }`)
//             .send({
//                 ...badData
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "age must be a number",
//                 "gender must be a string",
//             ],
//         });
//     });
// });