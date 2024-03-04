"use strict";

const { handlePrismaError, BadRequestError, NotFoundError } = require("../expressError");
const { prisma } = require("../prisma");
const { exclude } = require("../helpers/prisma");

class Match {
    /**Static Class for common methods for matches */


    /** Create match with data.
   *
   * Returns {id, {event}, {user}}
   *
   * Throws BadRequestError on duplicates.
   * Throws NotFoundError on not found.
   **/
    static async create(data) {
        const { eventId, guestEmail } = data;
        let guest, event = null;

        try {
            guest = await prisma.user.findUniqueOrThrow({
                where: { email: guestEmail }
            });
        } catch (err) { throw new NotFoundError(`${ guestEmail || "email" } not found.`); }

        try {
            event = await prisma.event.findUniqueOrThrow({
                where: { id: eventId }
            });
        } catch (err) {
            throw new NotFoundError(`event ${ eventId } not found.`);
        }


        if (guest.email === event.hostEmail) throw new BadRequestError(
            "user cannot match with own event.");

        try {
            let match = await prisma.match.create({
                data: { eventId, guestEmail },
                include: { user: true, event: true, }
            });

            match = exclude(match, ["eventId", "guestEmail"]);
            match.user = exclude(match.user, ["password", "createdAt"]);
            match.event = exclude(match.event, ["createdAt"]);

            return match;
        } catch (err) { throw new handlePrismaError(err); }
    }


    /** Gets all matches
     * Accepts min, max for pagination 
    *
    * Returns {id, {event}, {user}}
    **/
    static async getAll(min = 0, max = 100) {
        if (!Number.isInteger(min) || !Number.isInteger(max)) {
            throw new BadRequestError("Min and max must be integers");
        }
        min = min >= 0 ? min : 0;
        max = max >= 0 ? max - min : 100;
        let matches = await prisma.match.findMany({
            select: {
                id: true,
                user: {
                    select: {
                        "email": true,
                        "firstName": true,
                        "lastName": true,
                        "lastLogin": true,
                        "phoneNumber": true
                    }
                },
                event: {
                    select: {
                        "id": true,
                        "title": true,
                        "dateTime": true,
                        "description": true,
                        "payment": true,
                        "type": true,
                        "hostEmail": true,
                        "city": true,
                        "state": true,
                        "geoLocation": true,
                    }
                },
            },
            skip: min,
            take: max,
        });

        return matches;
    } catch(err) { throw new handlePrismaError(err); }


}


module.exports = Match;