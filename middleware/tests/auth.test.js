// "use strict";

// const jwt = require("jsonwebtoken");
// const { SECRET_KEY } = require("../../config");
// const { runBeforeAll } = require("../../_testCommon");
// const {
//     authenticateJWT,
//     ensureLoggedIn,
//     ensureAdmin,
//     ensureCorrectUserOrAdmin,
//     ensureCorrectUserOrAdminEvents,
//     ensureCorrectUserOrAdminMatches,
// } = require("../auth");


// describe("Test jwtAuthenticate", () => {
//     let nextMock = null;
//     let payload = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: false,
//     };

//     beforeAll(() => {
//         nextMock = jest.fn().mockReturnValue({ locals: { user: payload } });
//     });

//     test("works", async () => {
//         let token = jwt.sign(payload, SECRET_KEY);
//         const req = { headers: { authorization: token } };
//         let res = { locals: { user: null } };
//         res = await authenticateJWT(req, res, nextMock);
//         expect(res.locals.user).toMatchObject(payload);
//     });
// });


// describe("Test ensureLoggedIn", () => {
//     let nextMock = null;
//     let payload = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: false,
//     };

//     beforeAll(() => {
//         nextMock = jest.fn().mockReturnValue({ locals: { user: payload } });
//     });

//     test("works", async () => {
//         const req = null;
//         let res = { locals: { user: { email: "user@email.com" } } };
//         res = await ensureLoggedIn(req, res, nextMock);
//         expect(res.locals.user).toMatchObject(payload);
//     });

//     test("fails no user", async () => {
//         const req = null;
//         let res = {
//             locals: {},
//             status: function () { return res; },
//             json: function (err) {
//                 return "returns error";
//             }
//         };
//         let error = await ensureLoggedIn(req, res, nextMock);
//         expect(error).toEqual("returns error");

//     });
// });


// describe("Test EnsureAdmin", () => {
//     let nextMock = null;
//     let payloadAdmin = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: true,
//     };
//     let payloadNonAdmin = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: false,
//     };

//     beforeAll(() => {
//         nextMockAdmin = jest.fn().mockReturnValue({ locals: { user: payloadAdmin } });
//         nextMockNonAdmin = jest.fn().mockReturnValue({ locals: { user: payloadNonAdmin } });
//     });

//     test("works", async () => {
//         const req = null;
//         let res = { locals: { user: { email: "user@email.com", isAdmin: true } } };
//         res = await ensureAdmin(req, res, nextMockAdmin);
//         expect(res.locals.user).toMatchObject(payloadAdmin);
//     });

//     test("fails non admin user", async () => {
//         const req = null;
//         let res = {
//             locals: { user: { email: "user@email.com", isAdmin: false } },
//             status: function () { return res; },
//             json: function (err) {
//                 return "returns error";
//             }
//         };
//         let error = await ensureAdmin(req, res, nextMock);
//         expect(error).toEqual("returns error");
//     });
// });


// describe("Test ensureCorrectUserOrAdmin", () => {
//     let nextMock = null;
//     let payloadAdmin = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: true,
//     };
//     let payloadNonAdmin = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: false,
//     };

//     beforeAll(() => {
//         nextMockAdmin = jest.fn().mockReturnValue({ locals: { user: payloadAdmin } });
//         nextMockNonAdmin = jest.fn().mockReturnValue({ locals: { user: payloadNonAdmin } });
//     });

//     test("works admin", async () => {
//         const req = { params: { email: "wrongUser@email.com" } };
//         let res = {
//             locals: {
//                 user: { email: "user@email.com", isAdmin: true },
//             }
//         };

//         res = await ensureCorrectUserOrAdmin(req, res, nextMockAdmin);
//         expect(res.locals.user).toMatchObject(payloadAdmin);
//     });

//     test("works correct use", async () => {
//         const req = { params: { email: "user@email.com" } };
//         let res = { locals: { user: { email: "user@email.com", isAdmin: false } } };
//         res = await ensureCorrectUserOrAdmin(req, res, nextMockAdmin);
//         expect(res.locals.user).toMatchObject(payloadAdmin);
//     });

//     test("fails non admin incorrect user", async () => {
//         const req = { params: { email: "wrongUser@email.com" } };
//         let res = {
//             locals: {
//                 user: { email: "user@email.com", isAdmin: false },
//             },
//             status: function () { return res; },
//             json: function (err) {
//                 return "returns error";
//             }
//         };
//         let error = await ensureCorrectUserOrAdmin(req, res, nextMock);
//         expect(error).toEqual("returns error");
//     });
// });


// describe("Test ensureCorrectUserOrAdminEvents", () => {
//     let nextMock, existingUser, existingAdmin, existingEvent, existingMatch = null;
//     let payloadAdmin = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: true,
//     };
//     let payloadNonAdmin = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: false,
//     };

//     beforeAll(async () => {
//         nextMockAdmin = jest.fn().mockReturnValue({ locals: { user: payloadAdmin } });
//         nextMockNonAdmin = jest.fn().mockReturnValue({ locals: { user: payloadNonAdmin } });
//         ({
//             existingUser,
//             existingAdmin,
//             existingEvent,
//             existingMatch
//         } = await runBeforeAll());
//     });

//     test("works admin", async () => {
//         const req = { params: { id: existingEvent.id } };
//         let res = {
//             locals: {
//                 user: { email: "user@email.com", isAdmin: true },
//             }
//         };

//         res = await ensureCorrectUserOrAdminEvents(req, res, nextMockAdmin);
//         expect(res.locals.user).toMatchObject(payloadAdmin);
//     });

//     test("works correct user", async () => {
//         const req = { params: { id: existingEvent.id } };
//         let res = { locals: { user: { email: "test@email.com", isAdmin: false } } };
//         res = await ensureCorrectUserOrAdminEvents(req, res, nextMockAdmin);
//         expect(res.locals.user).toMatchObject(payloadAdmin);
//     });
//     test("fails non existing event", async () => {
//         const req = { params: { id: "notAnEvent" } };
//         let res = {
//             locals: {
//                 user: { email: "user@email.com", isAdmin: true },
//             },
//             status: function () { return res; },
//             json: function (err) {
//                 return "returns error";
//             }
//         };
//         let error = await ensureCorrectUserOrAdminEvents(req, res, nextMock);
//         expect(error).toEqual("returns error");
//     });

//     test("fails non admin incorrect user", async () => {
//         const req = { params: { id: existingEvent.id } };
//         let res = {
//             locals: {
//                 user: { email: "user@email.com", isAdmin: false },
//             },
//             status: function () { return res; },
//             json: function (err) {
//                 return "returns error";
//             }
//         };
//         let error = await ensureCorrectUserOrAdminEvents(req, res, nextMock);
//         expect(error).toEqual("returns error");
//     });
// });


// describe("Test ensureCorrectUserOrAdminMatches", () => {
//     let nextMock, existingUser, existingAdmin, existingEvent, existingMatch = null;
//     let payloadAdmin = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: true,
//     };
//     let payloadNonAdmin = {
//         email: "user@email.com",
//         phoneNumber: "1234567890",
//         isAdmin: false,
//     };

//     beforeAll(async () => {
//         nextMockAdmin = jest.fn().mockReturnValue({ locals: { user: payloadAdmin } });
//         nextMockNonAdmin = jest.fn().mockReturnValue({ locals: { user: payloadNonAdmin } });
//         ({
//             existingUser,
//             existingAdmin,
//             existingEvent,
//             existingMatch
//         } = await runBeforeAll());
//     });

//     test("works admin", async () => {
//         const req = {
//             body: {
//                 eventId: existingEvent.id,
//                 guestEmail: existingUser.email
//             }
//         };
//         let res = {
//             locals: {
//                 user: { email: "user@email.com", isAdmin: true },
//             }
//         };
//         res = await ensureCorrectUserOrAdminMatches(req, res, nextMockAdmin);
//         expect(res.locals.user).toMatchObject(payloadAdmin);
//     });

//     test("works correct user", async () => {
//         const req = {
//             body: {
//                 eventId: existingEvent.id,
//                 guestEmail: existingUser.email
//             }
//         };
//         let res = { locals: { user: { email: "test@email.com", isAdmin: false } } };
//         res = await ensureCorrectUserOrAdminMatches(req, res, nextMockAdmin);
//         expect(res.locals.user).toMatchObject(payloadAdmin);
//     });

//     test("fails non existing event", async () => {
//         const req = {
//             body: {
//                 eventId: "bad event Id",
//                 guestEmail: existingUser.email
//             }
//         };
//         let res = {
//             locals: {
//                 user: { email: "user@email.com", isAdmin: true },
//             },
//             status: function () { return res; },
//             json: function (err) {
//                 return "returns error";
//             }
//         };
//         let error = await ensureCorrectUserOrAdminMatches(req, res, nextMock);
//         expect(error).toEqual("returns error");
//     });

//     test("fails non admin incorrect user", async () => {
//         const req = {
//             body: {
//                 eventId: existingEvent.id,
//                 guestEmail: "non existing user"
//             }
//         };
//         let res = {
//             locals: {
//                 user: { email: "user@email.com", isAdmin: false },
//             },
//             status: function () { return res; },
//             json: function (err) {
//                 return "returns error";
//             }
//         };
//         let error = await ensureCorrectUserOrAdminMatches(req, res, nextMock);
//         expect(error).toEqual("returns error");
//     });
// });
