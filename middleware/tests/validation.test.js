// "use strict";
// const { validateRegister,
//     validateLogin,
//     validateUserUpdate,
//     validateEvent,
//     validateEventDate,
//     validateMatch,
//     validateProfile } = require("../validation");
// const { Data } = require("../../_testCommon");
// const moment = require("moment");


// describe("Test validateRegister", () => {
//     let nextMock = null;

//     beforeAll(() => {
//         nextMock = jest.fn().mockReturnValue("success");
//     });

//     test("works", async () => {
//         const req = { body: { ...Data.testUser, } };
//         const res = { locals: { errors: null, data: null } };
//         validateRegister(req, res, nextMock);
//         expect(res.locals.data).toMatchObject(Data.testUser);
//     });

//     test("fails bad data", async () => {
//         const req = { body: { firstName: 120 } };
//         const res = { locals: { errors: null, data: null } };
//         validateRegister(req, res, nextMock);
//         expect(res.locals.data).toBe(null);
//         expect(res.locals.errors).not.toBe(null);
//     });

//     test("fails empty data", async () => {
//         const req = { body: {} };
//         const res = { locals: { errors: null, data: null } };
//         validateRegister(req, res, nextMock);
//         expect(res.locals.data).toBe(null);
//         expect(res.locals.errors).not.toBe(null);
//     });
// });


// describe("Test validateLogin", () => {
//     let nextMock = null;

//     beforeAll(() => {
//         nextMock = jest.fn().mockReturnValue("success");
//     });

//     test("works email", async () => {
//         const req = {
//             body: {
//                 email: Data.testUser.email,
//                 password: "password"
//             }
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateLogin(req, res, nextMock);
//         expect(res.locals.data).toMatchObject(req.body);
//     });

//     test("works phoneNumber", async () => {
//         const req = {
//             body: {
//                 phoneNumber: Data.testUser.phoneNumber,
//                 password: "password"
//             }
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateLogin(req, res, nextMock);
//         expect(res.locals.data).toMatchObject(req.body);
//     });

//     test("fails bad data", async () => {
//         const req = {
//             body: {
//                 email: "test@email.com",
//                 password: "short"
//             }
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateLogin(req, res, nextMock);
//         expect(res.locals.data).toBe(null);
//         expect(res.locals.errors).not.toBe(null);
//     });

//     test("fails empty data", async () => {
//         const req = { body: {} };
//         const res = { locals: { errors: null, data: null } };
//         validateLogin(req, res, nextMock);
//         expect(res.locals.data).toBe(null);
//         expect(res.locals.errors).not.toBe(null);
//     });
// });


// describe("Test validateUserUpdate", () => {
//     let nextMock = null;

//     beforeAll(() => {
//         nextMock = jest.fn().mockReturnValue("success");
//     });

//     test("works", async () => {
//         const req = {
//             body: { firstName: "updateFirstName" }
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateUserUpdate(req, res, nextMock);
//         expect(res.locals.data).toMatchObject(req.body);
//     });

//     test("works phoneNumber", async () => {
//         const req = {
//             body: {
//                 phoneNumber: Data.testUser.phoneNumber,
//             }
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateUserUpdate(req, res, nextMock);
//         expect(res.locals.data).toMatchObject(req.body);
//     });

//     test("works new password", async () => {
//         const req = {
//             body: { newPassword: "newPassword", }
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateUserUpdate(req, res, nextMock);
//         expect(res.locals.data).toMatchObject(req.body);
//     });

//     test("fails bad data", async () => {
//         const req = {
//             body: {
//                 email: "test@email.com",
//                 password: "short"
//             }
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateUserUpdate(req, res, nextMock);
//         expect(res.locals.data).toBe(null);
//         expect(res.locals.errors).not.toBe(null);
//     });

//     test("fails empty data", async () => {
//         const req = { body: {} };
//         const res = { locals: { errors: null, data: null } };
//         validateUserUpdate(req, res, nextMock);
//         expect(res.locals.data).toMatchObject({});
//     });
// });


// describe("Test validateEvent", () => {
//     let nextMock = null;
//     const testEvent = {
//         geoLocation: [0.1234, 0.2345],
//         city: "new york",
//         state: "new york",
//         dateTime: "2024-07-20T00:10:02Z",
//         title: "testEvent",
//         description: "description",
//         type: [],
//         payment: null
//     };

//     beforeAll(() => {
//         nextMock = jest.fn().mockReturnValue("success");
//     });

//     test("works", async () => {
//         const req = {
//             body: testEvent
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateEvent(req, res, nextMock);
//         expect(res.locals.data).toMatchObject(testEvent);
//     });

//     test("fails bad data", async () => {
//         const req = { body: { title: 120 } };
//         const res = { locals: { errors: null, data: null } };
//         validateEvent(req, res, nextMock);
//         expect(res.locals.data).toBe(null);
//         expect(res.locals.errors).not.toBe(null);
//     });

//     test("fails empty data", async () => {
//         const req = { body: {} };
//         const res = { locals: { errors: null, data: null } };
//         validateEvent(req, res, nextMock);
//         expect(res.locals.data).toEqual({});
//         expect(res.locals.errors).toEqual(null);
//     });
// });


// describe("Test validateMatch", () => {
//     let nextMock = null;

//     beforeAll(() => {
//         nextMock = jest.fn().mockReturnValue("success");
//     });

//     test("works", async () => {
//         const testData = {
//             guestEmail: "test@email.com",
//             eventId: "someString"
//         };
//         const req = {
//             body: { ...testData }
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateMatch(req, res, nextMock);
//         expect(res.locals.data).toMatchObject(testData);
//     });

//     test("fails bad data", async () => {
//         const req = { body: { hostEmail: 120 } };
//         const res = { locals: { errors: null, data: null } };
//         validateMatch(req, res, nextMock);
//         expect(res.locals.data).toBe(null);
//         expect(res.locals.errors).not.toBe(null);
//     });

//     test("fails empty data", async () => {
//         const req = { body: {} };
//         const res = { locals: { errors: null, data: null } };
//         validateMatch(req, res, nextMock);
//         expect(res.locals.data).toBe(null);
//         expect(res.locals.errors).not.toBe(null);
//     });
// });


// describe("Test validateProfile", () => {
//     let nextMock = null;

//     beforeAll(() => {
//         nextMock = jest.fn().mockReturnValue("success");
//     });

//     test("works", async () => {
//         const testData = {
//             age: 12,
//             bio: "I am a user profile",
//             gender: "male"
//         };
//         const req = {
//             body: { ...testData }
//         };
//         const res = { locals: { errors: null, data: null } };
//         validateProfile(req, res, nextMock);
//         expect(res.locals.data).toMatchObject(testData);
//     });

//     test("fails bad data", async () => {
//         const req = { body: { hostEmail: 120 } };
//         const res = { locals: { errors: null, data: null } };
//         validateProfile(req, res, nextMock);
//         expect(res.locals.data).toBe(null);
//         expect(res.locals.errors).not.toBe(null);
//     });

//     test("fails empty data", async () => {
//         const req = { body: {} };
//         const res = { locals: { errors: null, data: null } };
//         validateProfile(req, res, nextMock);
//         expect(res.locals.data).toMatchObject({});
//     });
// });


// describe("Test validateEventDate", () => {
//     test("works", async () => {
//         const date = Data.getDate(2);

//         validateEventDate(date);
//     });

//     test("fails date further than 6th months", async () => {
//         const date = Data.getDate(7);

//         expect(() =>
//             validateEventDate(date))
//             .toThrow("Events must be scheduled within the next six months.");
//     });

//     test("fails date in past", async () => {
//         const now = moment.utc();
//         const date = now.subtract(2, "M");

//         expect(() =>
//             validateEventDate(date))
//             .toThrow("date must be in the future.");
//     });

//     test("fails invalid date", async () => {
//         const date = "not a date";

//         expect(() =>
//             validateEventDate(date))
//             .toThrow("Must be valid date.");
//     });

// });