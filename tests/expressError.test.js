"use strict";

const { handlePrismaError, BadRequestError, InternalError } = require("../expressError");
const { Prisma } = require("@prisma/client");

describe("Test handle Prisma Error", () => {

    test("works PrismaClientKnownRequestError", async () => {
        const err = new Prisma.PrismaClientKnownRequestError("error", { meta: { target: "val" } });
        const error = handlePrismaError(err);
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe("Duplicate field value val.");
    });

    test("works PrismaClientUnknownRequestError", async () => {
        const err = new Prisma.PrismaClientUnknownRequestError("error", {});
        const error = handlePrismaError(err);
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe("Invalid ID.");
    });

    test("works PrismaClientValidationError", async () => {
        const err = new Prisma.PrismaClientValidationError("error", {});
        const error = handlePrismaError(err);
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe("Invalid input data.");
    });

    test("works Internal Error", async () => {
        const err = new BadRequestError("error");
        const error = handlePrismaError(err);
        expect(error).toBeInstanceOf(InternalError);
        expect(error.message).toBe("Something went wrong.");

    });

});

