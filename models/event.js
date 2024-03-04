"use strict";

const { handlePrismaError, NotFoundError, BadRequestError } = require("../expressError");
const { deleteImages } = require("../middleware/images");
const { prisma } = require("../prisma");
const { prepImages } = require("../helpers/prisma");
const { getWithinRange } = require("../helpers/rangeFinder");
const { excludeFromAll, exclude } = require("../helpers/prisma");

class Event {
    /**Static Class for common methods for matches */


    /** Create event with data.
   *
   * Returns {hostEmail, title, dateTime, description, payment}
   **/
    static async create(data) {
        const {
            user,
            title,
            dateTime,
            description,
            payment,
            city,
            geoLocation,
            state,
            images } = data;

        const hostEmail = user.email;

        const FormattedImages = prepImages(images, user.email);

        if (user.events.length >= 6) {
            throw new BadRequestError("Max of 6 events at one time.");
        }

        try {
            const event = await prisma.event.create({
                data: {
                    hostEmail,
                    title,
                    dateTime,
                    description,
                    payment,
                    city,
                    state,
                    geoLocation,
                    images: { create: FormattedImages }
                },
                include: { images: true }
            });

            return event;
        } catch (err) {
            await deleteImages(images);
            throw handlePrismaError(err);
        }
    }

    static async getEvents(user, min, max, range) {
        try {
            let likedEvents = [];
            for (let like of user.likes) {
                if (like.userLikes) likedEvents.push(like.likesEventId);
            }
            if (range) {
                if (!user.profile) throw new BadRequestError("no user profile.");
                let events = await prisma.event.findMany({
                    where: {
                        hostEmail: { not: user.email },
                        likes: {
                            every: {
                                likesEventId: { notIn: likedEvents }
                            }
                        }
                    },
                    include: {
                        host: {
                            include: { profile: { select: { images: true } } }
                        },
                        images: true
                    }
                });
                let filtered = [];
                for (let event of events) {

                    //Flip LatLgn to LngLat because google and Turf use opposing storage methods
                    if (getWithinRange(
                        [event.geoLocation[1], event.geoLocation[0]],
                        [user.profile?.geoLocation[1], user?.profile?.geoLocation[0]],
                        range)) {
                        const currEvent = exclude(event, ["createdAt"]);
                        filtered.push(currEvent);
                    }
                }
                events = filtered.slice(min, max);
                return filtered.slice(min, max);
            } else {
                let events = await prisma.event.findMany({
                    where: {
                        hostEmail: { not: user.email },
                        likes: {
                            eventId: { notIn: likedEvents }
                        }
                    },
                    skip: min,
                    take: max,
                });
                if (!events.length) return res.json({ events: ["no events found."] });
                events = excludeFromAll(events, ["createdAt"]);
                return events;
            }
        } catch (err) {
            console.log(err);
            throw new err;
        }
    }


    /** Patch event with data.
    *
    *Returns {hostEmail, title, dateTime, description, payment}
    *
    * Throws NotFoundError on not found event.
    **/
    static async patch(data, id) {
        let event = null;
        const { user, images } = data;
        try {
            event = await prisma.event.findUniqueOrThrow({
                where: { eventId: id }
            });
        } catch (err) { throw new NotFoundError("event not found."); }

        try {
            if (data.removeImages?.length) {
                try {
                    await deleteImages(data.removeImages);
                    let toBeDeleted = [];
                    for (let image of data.removeImages) {
                        toBeDeleted.push({ url: { equals: image } });
                    }
                    await prisma.image.deleteMany({
                        where: {
                            OR: toBeDeleted
                        }
                    });
                } catch (err) {
                    throw err;
                }
            };
            let eventData = {};
            let update = false;
            for (let key of [
                "title",
                "dateTime",
                "description",
                "city",
                "state",
                "geoLocation"])
                if (data[key] || data[key] === null) {
                    eventData[key] = data[key];
                    update = true;
                }
            if ((data.payment === null && event.payment !== null)
                || (data.payment !== null && event.payment === null)) {
                eventData.payment = data.payment;
            }
            if (images) {
                const FormattedImages = prepImages(images, user.email);
                eventData.images = {
                    create: FormattedImages
                };
            }

            if (update) {
                event = await prisma.event.update({
                    where: { eventId: id },
                    data: eventData,

                    include: { images: true }
                });
            }
        } catch (err) { throw new handlePrismaError(err); }

        return event;
    }

}

module.exports = Event;
