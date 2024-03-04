// "use strict";

// const { Data, clearDb, runBeforeAll } = require("../../_testCommon");
// const { prisma } = require("../../prisma");
// const User = require("../user");

// describe("Test Authenticate", () => {
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

//     test("works email", async () => {
//         let user = null;
//         user = await User.authenticate(
//             existingUser.email,
//             "password");
//         delete existingUser.password;
//         expect(user).toMatchObject(existingUser);
//     });

//     test("works phone", async () => {
//         let user = null;

//         user = await User.authenticate(
//             existingUser.phoneNumber,
//             "password"
//         );
//         delete existingUser.password;
//         expect(user).toMatchObject(existingUser);
//     });

//     test("fails invalid email", async () => {
//         expect(async () =>
//             await User.authenticate("Wack@email.com", "bad password"))
//             .rejects
//             .toThrow();
//     });

//     test("fails invalid phone", async () => {
//         expect(async () =>
//             await User.authenticate("badphone", "bad password"))
//             .rejects
//             .toThrow();
//     });

//     test("fails invalid password", () => {

//         expect(async () =>
//             await User.authenticate(existingUser.phoneNumber, "bad password"))
//             .rejects
//             .toThrow();
//     });
// });

// describe("Test Register", () => {
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
//         const user = await User.register(Data.testUser);

//         expect(user).not.toHaveProperty("password");
//         delete Data.testUser.password;
//         expect(user).toMatchObject(Data.testUser);
//     });

//     test("fails for duplicate user", () => {
//         expect(async () => await User.register(Data.testUser).toThrow("Email or phone number are already registered"));

//     });

//     test("fails incomplete data", () => {
//         //Lacks first name
//         expect(async () => await User.register({
//             email: "valid@email.com",
//             lastName: "lastName",
//             password: "password",
//             phoneNumber: "blah blah"

//         }).toThrow("please fill out required fields"));
//     });
// });

// describe("Update Password", () => {
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

//         const user = await User.updatePassword({
//             newPassword: "newpassword",
//             password: Data.existingUser.password,
//             user: existingUser
//         });

//         expect(user.password).not.toEqual(existingUser.password);
//     });

//     test("fails invalid password", async () => {
//         expect(async () => await User.updatePassword({
//             newPassword: "newpassword",
//             password: "invalidPassword",
//             user: existingUser
//         }).toThrow("invalid password."));
//     });

// });

// describe("Patch user", () => {
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
//         const user = await User.patch({
//             email: existingUser.email,
//             lastName: "newLastName",
//         });

//         expect(existingUser.lastName).not.toEqual(user.lastName);
//     });

//     test("can update password", async () => {
//         const user = await User.patch({
//             email: existingUser.email,
//             newPassword: "newPassword",
//             password: "password"
//         });

//         expect(user.password).not.toEqual(existingUser.password);
//     });

//     test("can update password and other info", async () => {
//         const user = await User.patch({
//             email: existingUser.email,
//             lastName: "DiffLastName",
//             newPassword: "password",
//             password: "newPassword"
//         });

//         expect(existingUser.lastName).not.toEqual(user.lastName);
//         expect(user.lastName).toEqual("DiffLastName");
//         expect(user.password).not.toEqual(existingUser.password);
//     });

//     test("can update phone number", async () => {
//         const user = await User.patch({
//             email: existingUser.email,
//             phoneNumber: "12345678900"
//         });

//         expect(existingUser.phoneNumber).not.toEqual(user.phoneNumber);
//     });

//     test("can set phon number to null", async () => {
//         const user = await User.patch({
//             email: existingUser.email,
//             phoneNumber: null
//         });

//         expect(user.phoneNumber).toEqual(null);
//     });

//     test("can't update phone number if already in use", async () => {
//         expect(async () => await User.patch({
//             email: existingUser.email,
//             phoneNumber: "12345678902"
//         }).toThrow("Duplicate field value phone_number."));
//     });

//     test("error if cannot find user", async () => {
//         expect(async () =>
//             await User.patch({
//                 email: "Wack@email.com",
//                 phoneNumber: "12345678900"
//             }))
//             .rejects
//             .toThrow("user not found.");
//     });

// });

// describe("Create Token", () => {
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


//     test("works non admin", () => {
//         User.createToken(Data.testUser);
//     });

//     test("works admin", () => {

//         User.createToken(existingAdmin);
//     });

// });

// describe("Create Profile", () => {
//     let existingUser, existingAdmin, existingEvent, existingMatch = null;

//     beforeEach(async () => {
//         ({
//             existingUser,
//             existingAdmin,
//             existingEvent,
//             existingMatch
//         } = await runBeforeAll());
//     });

//     afterEach(async () => {
//         await clearDb();
//     });

//     test("works", async () => {
//         const profile = await User.createProfile({
//             email: existingUser.email,
//             ...Data.userProfile
//         });

//         delete existingUser.password;
//         delete existingUser.createdAt;
//         delete existingUser.lastLogin;

//         let profileInfo = Data.userProfile;
//         profileInfo.user = existingUser;
//         expect(profile).toMatchObject(profileInfo);
//     });

//     test("fails with missing data", () => {
//         expect(async () => await User.createProfile({
//             email: existingUser.email,
//             ...Data.userProfile
//         })
//             .toThrow("Invalid input data."));

//     });

//     test("fails when user already has a profile", async () => {
//         await User.createProfile({
//             email: existingUser.email,
//             ...Data.userProfile
//         });

//         expect(async () => await User.createProfile({
//             email: existingUser.email,
//             ...Data.userProfile
//         })
//             .toThrow("Profile for this account please update."));
//     });

// });

// describe("Patch Profile", () => {
//     let existingUser, existingAdmin, existingEvent, existingMatch = null;

//     beforeEach(async () => {
//         ({
//             existingUser,
//             existingAdmin,
//             existingEvent,
//             existingMatch
//         } = await runBeforeAll());
//     });

//     afterEach(async () => {
//         await clearDb();
//     });

//     test("works", async () => {
//         let profile = await User.createProfile({
//             email: existingUser.email,
//             ...Data.userProfile
//         });

//         profile = await User.patchProfile({
//             email: existingUser.email,
//             ...Data.testProfile
//         });

//         expect(profile).not.toMatchObject(Data.userProfile);
//     });

//     test("fails with bad data", async () => {
//         await User.createProfile({
//             email: existingUser.email,
//             ...Data.testProfile
//         });

//         expect(async () => await User.patchProfile({
//             email: "test@bademail.com",
//             age: "wack",
//             bio: 12,
//             gender: true
//         })
//             .toThrow("Invalid input data."));
//     });

//     test("error if cannot find user", async () => {
//         expect(async () =>
//             await User.patchProfile({
//                 email: "Wack@email.com",
//             }))
//             .rejects
//             .toThrow("user profile not found.");
//     });
// });