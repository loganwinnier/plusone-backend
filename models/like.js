"use strict";

const { handlePrismaError, BadRequestError, NotFoundError } = require("../expressError");
const { prisma } = require("../prisma");
const { exclude } = require("../helpers/prisma");
const { Chat } = require("./chat");

class Like {
    /**Static Class for common methods for matches */


    /** Create like  with data, {user**either obj or string**, eventId**string**}.
   *    If both event and user like each other a chat is generated and will be returned
   * 
   *    Returns like or chat
   **/
    static async createOrAdd(user, eventId) {
        let like = null;
        let eventLikes = false, userLikes = false;

        //check if input is string. this means that user was param
        if (typeof user === "string") {
            //User in param event liking user
            console.log("Liking Event");
            eventLikes = true;
            user = { email: user };
        } else {
            //else,   user liking event
            console.log("Liking User");
            userLikes = true;
        }

        try {
            //Find the like to see if one or other have liked each other 
            like = await prisma.like.findUniqueOrThrow({
                where: {
                    likeId: { userEmail: user.email, likesEventId: eventId }
                },
                include: {
                    user: true, event: true
                }
            });

            //Update like accordingly 
            try {
                like = await prisma.like.update({
                    where: {
                        likeId: { userEmail: user.email, likesEventId: eventId }
                    },
                    data: {
                        eventLikes: like.eventLikes == true ? true : eventLikes,
                        userLikes: like.userLikes == true ? true : userLikes
                    },
                    include: {
                        user: true,
                        event: {
                            select: {
                                hostEmail: true,
                                eventId: true,
                            }
                        }
                    }
                });

                if (like.eventLikes && like.userLikes) {
                    return await Chat.create(like.user, like.event);
                }
                return { "like": like };

            } catch (err) {
                throw handlePrismaError(err);
            }

        } catch (err) {
            let target = null;
            try {
                if (eventLikes) {
                    target = `user ${ user.email }`;
                    user = await prisma.user.findUniqueOrThrow({
                        where: {
                            email: user.email
                        }
                    });
                } else {
                    target = `event ${ eventId }`;
                    await prisma.event.findUniqueOrThrow({
                        where: {
                            eventId
                        }
                    });
                }
                like = await prisma.like.create({
                    data: {
                        likesEventId: eventId,
                        userEmail: user.email,
                        eventLikes: eventLikes || false,
                        userLikes
                    }
                });
                return { like };

            } catch (err) {
                throw handlePrismaError(err, target);
            }
        }
    }
}

module.exports = { Like };
