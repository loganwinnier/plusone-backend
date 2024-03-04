"use strict";

const { Data, clearDb, runBeforeAll } = require("../../_testCommon");
const { prisma } = require("../../prisma");

describe("create user", () => {
    let currDate = new Date(Date.now());

    afterEach(async () => {
        await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await clearDb();
    });

    test("works", async () => {
        const user = await prisma.user.create({
            data: Data.testUser
        });

        //Check that each key from the User data appears in db 
        for (let key in Data.testUser) {
            expect(user).toHaveProperty(key);
        }
        expect(user["isAdmin"]).toBeFalsy();

        //Check for correct date
        //Remove seconds and milliseconds from all date objects
        user["createdAt"].setMilliseconds(0);
        user["createdAt"].setSeconds(0);

        user["lastLogin"].setMilliseconds(0);
        user["lastLogin"].setSeconds(0);

        currDate.setMilliseconds(0);
        currDate.setSeconds(0);

        expect(user["createdAt"]).toEqual(currDate);
        expect(user["lastLogin"]).toEqual(currDate);

    });

    test("fails with bad email", async () => {
        const data = { ...Data.testUser };
        data.email = Data.badUser.email;
        let user = null;
        try {
            user = await prisma.user.create({ data }).toThrow();
            expect(user).toBeNull();
        } catch {
            expect(user).toBeNull();
        }
    });

    test("fails with previously email already in use", async () => {
        let user = await prisma.user.create({
            data: Data.testUser
        });

        //change phone so unique constraint on phone is not violated
        const changePhone = { ...Data.testUser };
        changePhone.phoneNumber = "09876543212";

        //Try catch since if fails prisma stops running and does not throw error
        // that jest recognizes. If goes into catch block can assume creation failed
        try {
            await prisma.user.create({ data: changePhone });
            expect(true).toBeFalsy();
        } catch {
            expect(false).toBeFalsy();
        }

    });

    test("fails with previously phone already in use", async () => {
        let user = await prisma.user.create({
            data: Data.testUser
        });

        //change email so unique constraint on email is not violated
        const changeEmail = { ...Data.testUser };
        changeEmail.email = "different@email.com";

        //Try catch since if fails prisma stops running and does not throw error
        // that jest recognizes. If goes into catch block can assume creation failed
        try {
            await prisma.user.create({ data: changeEmail });
            expect(true).toBeFalsy();
        } catch {
            expect(false).toBeFalsy();
        }
    });
});

describe("create event", () => {
    let currDate = new Date(Date.now());

    beforeAll(async () => {
        await runBeforeAll();
    });

    afterEach(async () => {
        await prisma.event.deleteMany({});
        await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await clearDb();
    });

    test("works", async () => {

        let event = await prisma.event.create({
            data: Data.testEvent
        });
        //Check that each key from the Event data appears in db 
        for (let key in Data.testEvent) {
            expect(event).toHaveProperty(key);
        }

        //Check for correct date
        //Remove seconds and milliseconds from all date objects
        event["createdAt"].setMilliseconds(0);
        event["createdAt"].setSeconds(0);
        currDate.setMilliseconds(0);
        currDate.setSeconds(0);

        expect(event["createdAt"]).toEqual(currDate);

    });

    test("fails with bad data", async () => {
        const data = { ...Data.badEvent };
        let event = null;
        try {
            event = await prisma.event.create({ data }).toThrow();
            expect(event).toBeNull();
        } catch {
            expect(event).toBeNull();
        }
    });
});

describe("create match", () => {
    let currDate = new Date(Date.now());
    let existingUser, existingAdmin, existingEvent = null;

    beforeAll(async () => {
        ({ existingAdmin, existingEvent, existingUser } = await runBeforeAll());
    });

    afterAll(async () => {
        await clearDb();
    });

    test("works", async () => {
        let match = null;

        const event = await prisma.event.create({ data: Data.testEvent });

        match = await prisma.match.create({
            data: {
                eventId: event.id,
                guestEmail: existingAdmin.email
            },
        });

        expect(match).not.toBeNull();
    });

    test("fails existing match", async () => {
        let match = null;
        try {
            match = await prisma.match.create({
                data: {
                    eventId: existingEvent.id,
                    guestEmail: existingAdmin.email
                },
            });
            expect(match).toBeNull();
        } catch {
            expect(match).toBeNull();
        }

    });

});
