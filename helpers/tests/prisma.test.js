"use strict";

const { exclude, excludeFromAll } = require("../prisma");
const { Data } = require("../../_testCommon");

describe("Test Exclude", () => {

    test("works", async () => {
        const obj = exclude(Data.testUser, ["firstName", "password"]);

        expect(obj).not.toHaveProperty('firstName', "password");
    });

    test("works empty filter", () => {
        const obj = exclude(Data.testUser, []);

        expect(obj).toMatchObject(Data.testUser);
    });

    test("works empty obj and filter", () => {
        const obj = exclude({}, []);

        expect(obj).toMatchObject({});
    });

    test("works empty obj", () => {
        const obj = exclude({}, ["password"]);

        expect(obj).toMatchObject({});
    });
});

describe("Test ExcludeFromAll", () => {

    test("works", async () => {
        const arr = excludeFromAll([Data.testUser, Data.existingUser], ["firstName", "password"]);

        expect(arr[0]).not.toHaveProperty('firstName', "password");
        expect(arr[1]).not.toHaveProperty('firstName', "password");
    });

    test("works empty filter", () => {
        const arr = excludeFromAll([Data.testUser, Data.existingUser], []);

        expect(arr[0]).toMatchObject(Data.testUser);
        expect(arr[1]).toMatchObject(Data.existingUser);
    });

    test("works empty arr and filter", () => {
        const arr = excludeFromAll([], []);

        expect(arr.length).toBe(0);
    });

    test("works empty arr", () => {
        const arr = excludeFromAll([], ["password"]);

        expect(arr.length).toBe(0);
    });
});