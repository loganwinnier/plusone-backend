// "use strict";

// const { Data, clearDb, runBeforeAll, createUser } = require("../../_testCommon");
// const request = require("supertest");
// const app = require("../../app");



// describe("post users route", () => {
//     let adminToken, existingUserToken = null;

//     beforeAll(async () => {
//         ({
//             adminToken,
//             existingUserToken,
//         } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works", async () => {
//         const resp = await request(app)
//             .post("/users")
//             .send({
//                 ...Data.testUser
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({
//             "token": expect.any(String)
//         });
//     });

//     test("fails non admin", async () => {
//         const resp = await request(app)
//             .post("/users")
//             .send({
//                 ...Data.testUser
//             }).set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails non admin", async () => {
//         const resp = await request(app)
//             .post("/users")
//             .send({
//                 ...Data.testUser
//             });
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails bad data", async () => {
//         const badData = { ...Data.testUser };
//         delete badData.password;
//         const resp = await request(app)
//             .post("/users")
//             .send({
//                 ...badData
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "password is required"],
//         });
//     });
// });


// describe("get users route", () => {
//     let adminToken, existingUserToken = null;

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
//             .get("/users")
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({
//             "users": [
//                 {
//                     "email": "test@email.com",
//                     "firstName": "Test",
//                     "isAdmin": false,
//                     "lastLogin": expect.anything(),
//                     "lastName": "User1",
//                     "phoneNumber": "1234567890",
//                 },
//                 {
//                     "email": "admin@email.com",
//                     "firstName": "Admin",
//                     "isAdmin": true,
//                     "lastLogin": expect.anything(),
//                     "lastName": "User1",
//                     "phoneNumber": "12345678902",
//                 },
//             ]
//         });
//     });

//     test("fails non admin", async () => {
//         const resp = await request(app)
//             .get("/users")
//             .set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails signed out", async () => {
//         const resp = await request(app)
//             .get("/users");
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });
// });


// describe("get single users route", () => {
//     let adminToken, existingUserToken, existingUser, testUserToken = null;
//     const userObj = {
//         "user": {
//             "email": "test@email.com",
//             "events": expect.arrayContaining([]),
//             "firstName": "Test",
//             "isAdmin": false,
//             "lastLogin": expect.anything(),
//             "lastLogin": expect.anything(),
//             "lastName": "User1",
//             "matches": [],
//             "phoneNumber": "1234567890",
//             "profile": null,
//         },
//     };

//     beforeAll(async () => {
//         ({
//             existingUser,
//             adminToken,
//             existingUserToken,
//             testUserToken
//         } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });

//     test("works admin", async () => {
//         const resp = await request(app)
//             .get(`/users/${ existingUser.email }`)
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual(userObj);
//     });

//     test("works same user", async () => {
//         const resp = await request(app)
//             .get(`/users/${ existingUser.email }`)
//             .set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual(userObj);
//     });

//     test("fails non admin and non auth'd user", async () => {
//         const resp = await request(app)
//             .get(`/users/${ existingUser.email }`)
//             .set("authorization", `Bearer ${ testUserToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails signed out", async () => {
//         const resp = await request(app)
//             .get(`/users/${ existingUser.email }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });
// });


// describe("patch users route", () => {
//     let adminToken, existingUserToken, testUserToken, existingUser = null;

//     beforeAll(async () => {
//         ({
//             existingUser,
//             testUserToken,
//             adminToken,
//             existingUserToken,
//         } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works admin", async () => {
//         const resp = await request(app)
//             .patch(`/users/${ existingUser.email }`)
//             .send({
//                 firstName: "New Name"
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({
//             "user": {
//                 "email": "test@email.com",
//                 "firstName": "New Name",
//                 "isAdmin": false,
//                 "lastLogin": expect.anything(),
//                 "lastName": "User1",
//                 "phoneNumber": "1234567890",
//             }
//         });
//     });

//     test("works correct user", async () => {
//         const resp = await request(app)
//             .patch(`/users/${ existingUser.email }`)
//             .send({
//                 firstName: "New Name"
//             }).set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual({
//             "user": {
//                 "email": "test@email.com",
//                 "firstName": "New Name",
//                 "isAdmin": false,
//                 "lastLogin": expect.anything(),
//                 "lastName": "User1",
//                 "phoneNumber": "1234567890",
//             }
//         });
//     });

//     test("fails non admin and non auth'd user", async () => {
//         const resp = await request(app)
//             .patch(`/users/${ existingUser.email }`)
//             .send({
//                 ...Data.testUser
//             });
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails bad data", async () => {
//         const badData = { ...Data.testUser };
//         const resp = await request(app)
//             .patch(`/users/${ existingUser.email }`)
//             .send({
//                 ...badData
//             }).set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "isAdmin is not allowed",
//                 "email is not allowed",
//             ],
//         });
//     });
// });


// describe("delete user route", () => {
//     let adminToken, existingUserToken, existingUser, testUserToken = null;

//     beforeAll(async () => {
//         ({
//             existingUser,
//             adminToken,
//             existingUserToken,
//             testUserToken
//         } = await runBeforeAll());
//     });

//     beforeEach(async () => {
//         try {
//             await createUser(Data.existingUser);
//         } catch {
//             console.log("user still exists");
//         }
//     });

//     afterAll(async () => {
//         await clearDb();
//     });

//     test("works admin", async () => {
//         const resp = await request(app)
//             .delete(`/users/${ existingUser.email }`)
//             .set("authorization", `Bearer ${ adminToken }`);
//         expect(resp.body).toEqual({ deleted: existingUser.email });
//     });

//     test("works same user", async () => {
//         const resp = await request(app)
//             .delete(`/users/${ existingUser.email }`)
//             .set("authorization", `Bearer ${ existingUserToken }`);
//         expect(resp.body).toEqual({ deleted: existingUser.email });
//     });

//     test("fails non admin and non auth'd user", async () => {
//         const resp = await request(app)
//             .delete(`/users/${ existingUser.email }`)
//             .set("authorization", `Bearer ${ testUserToken }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });

//     test("fails signed out", async () => {
//         const resp = await request(app)
//             .delete(`/users/${ existingUser.email }`);
//         expect(resp.body).toEqual({
//             "error": [
//                 "Failed to authenticate user."],
//         });
//     });
// });