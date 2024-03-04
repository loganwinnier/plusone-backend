// "use strict";

// const { Data, clearDb, runBeforeAll } = require("../../_testCommon");
// const request = require("supertest");
// const app = require("../../app");

// describe("login route", () => {
//     let existingUser = null;

//     beforeAll(async () => {
//         ({ existingUser } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });


//     test("works with email", async () => {
//         const resp = await request(app)
//             .post("/auth/login")
//             .send({
//                 email: existingUser.email,
//                 password: Data.existingUser.password,
//             });
//         expect(resp.body).toEqual({
//             "token": expect.any(String)
//         });
//     });

//     test("works with phone", async () => {
//         const resp = await request(app)
//             .post("/auth/login")
//             .send({
//                 phoneNumber: existingUser.phoneNumber,
//                 password: Data.existingUser.password,
//             });
//         expect(resp.body).toEqual({
//             "token": expect.any(String)
//         });
//     });

//     test("fails with wrong email", async () => {

//         let resp = await request(app)
//             .post("/auth/login")
//             .send({
//                 email: "notagood@email.com",
//                 password: Data.existingUser.password,
//             });

//         const body = await resp.body;
//         expect(resp.status).toEqual(404);
//         expect(body.error[0]).toEqual("No account with email notagood@email.com.");
//     });

//     test("fails with wrong phoneNumber", async () => {
//         let resp = await request(app)
//             .post("/auth/login")
//             .send({
//                 phoneNumber: "notRealPhone",
//                 password: Data.existingUser.password,
//             });

//         const body = await resp.body;
//         expect(resp.status).toEqual(404);
//         expect(body.error[0]).toEqual("No account with phone number notRealPhone.");
//     });

//     test("fails with wrong password", async () => {
//         let resp = await request(app)
//             .post("/auth/login")
//             .send({
//                 phoneNumber: existingUser.phoneNumber,
//                 password: "wrongPassword",
//             });

//         const body = await resp.body;
//         expect(resp.status).toEqual(401);
//         expect(body.error[0]).toEqual("Invalid phone or password.");
//     });
// });

// describe("register route", () => {
//     let existingUser = null;

//     beforeAll(async () => {
//         ({ existingUser } = await runBeforeAll());
//     });

//     afterAll(async () => {
//         await clearDb();
//     });

//     test("works", async () => {
//         let resp = await request(app)
//             .post("/auth/register")
//             .send({
//                 ...Data.testUser
//             });
//         expect(resp.body).toEqual({
//             "token": expect.any(String)
//         });
//         expect(resp.status).toEqual(201);
//     });

//     test("fails with duplicate test data", async () => {
//         let resp = await request(app)
//             .post("/auth/register")
//             .send({
//                 ...Data.existingUser
//             });
//         expect(resp.body.error[0]).toEqual('Email or phone number are already registered.');
//         expect(resp.status).toEqual(400);
//     });
// });
