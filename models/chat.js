const { handlePrismaError, BadRequestError, NotFoundError } = require("../expressError");
const { prisma } = require("../prisma");


class Chat {
    /**Static Class for common methods for matches */


    /** Create chat  with data, {user, event}.
   *    
   * 
   *    Returns chat
   **/
    static async create(user, event) {

        try {
            const ordered = [user.email, event.hostEmail].sort();
            const data = await prisma.chat.findUnique({
                where: {
                    userOneEmail_userTwoEmail:
                    {
                        userOneEmail: ordered[0],
                        userTwoEmail: ordered[1]
                    }

                },
                select: {
                    associatedEvents: { select: { eventId: true } },

                }
            });
            const associatedEvents = data?.associatedEvents ? data.associatedEvents : [];

            const chat = await prisma.chat.upsert({
                where: {
                    userOneEmail_userTwoEmail: {
                        userOneEmail: ordered[0],
                        userTwoEmail: ordered[1],
                    }
                },
                update: {
                    associatedEvents: { set: [...associatedEvents, { eventId: event.eventId }] }
                },
                create: {
                    associatedEvents: {
                        connect: { eventId: event.eventId }
                    },
                    userOneEmail: ordered[0],
                    userTwoEmail: ordered[1],
                }
            });
            return { "chat": chat };
        } catch (err) {
            handlePrismaError(err);
        }
    }

    /** Gets all chats
    * Accepts min, max for pagination 
   *
   * Returns {id, {event}, {user}}
   **/
    static async getAll(user, min = 0, max = 100) {
        if (!Number.isInteger(min) || !Number.isInteger(max)) {
            throw new BadRequestError("Min and max must be integers");
        }
        min = min >= 0 ? min : 0;
        max = max >= 0 ? max - min : 100;
        try {
            const chats = await prisma.chat.findMany({
                where: {
                    OR: [
                        {
                            userOneEmail: {
                                equals: user.email
                            }
                        },
                        {
                            userTwoEmail: {
                                equals: user.email
                            }
                        }
                    ]
                },
                orderBy: {
                    lastMessage: { sort: "desc" }
                },
                include: {
                    userOne: {
                        include: {
                            profile: { include: { images: true } }
                        }
                    },
                    userTwo: {
                        include: {
                            profile: { include: { images: true } }
                        }
                    },
                },

                skip: min,
                take: max,
            });
            return chats;
        } catch (err) {
            throw handlePrismaError(err);
        }

    } catch(err) { throw new handlePrismaError(err); }
}

module.exports = { Chat };