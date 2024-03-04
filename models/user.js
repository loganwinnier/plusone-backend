"use strict";

const bcrypt = require("bcrypt");
const { BadRequestError, handlePrismaError, UnauthorizedError, NotFoundError, InternalError } = require("../expressError");
const { prisma } = require("../prisma");
const { BCRYPT_WORK_FACTOR, SECRET_KEY, JWTOPTIONS } = require("../config");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { prepImages } = require("../helpers/prisma");
const { deleteImages } = require("../middleware/images");
const { getWithinRange } = require("../helpers/rangeFinder");
const { excludeFromAll, exclude } = require("../helpers/prisma");



class User {
    /**Static Class for common methods for user and user's profile */


    /**update user password
   *
   * Returns {isAdmin, email, firstName, lastName, lastLogin, phoneNumber}
   *
   * Throws UnauthorizedError on invalid old password.
   * Throws InternalError on failing to update.
   **/
    static async updatePassword(body) {
        let { newPassword, password, user } = body;
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedError("Invalid password.");

        try {
            let hashedPassword = await bcrypt.hash(newPassword, BCRYPT_WORK_FACTOR);
            user = await prisma.user.update({
                where: { email: user.email },
                data: { password: hashedPassword }
            });
        } catch (err) { throw new InternalError("Something went wrong."); }

        delete user.password;
        return user;
    }

    /** GET / => {event, event, ...}
 * Accepts query of min, max: default 0 , 100 
 * 
 * Returns Json like: { events: [{ id, title, dateTime, description, payment, hostEmail }, {event}, ...}]
 *
 * Authorization required: signed-in
 **/
    static async getUsers(eventId, min, max, range) {

        let event;
        if (eventId) {
            try {
                event = await prisma.event.findUniqueOrThrow({
                    where: { eventId, },
                    include: { likes: true }
                });
            } catch (err) {
                throw new NotFoundError(`No event ${ eventId }.`);
            };


            try {
                let likedUsers = [];
                for (let like of event.likes) {
                    if (like.eventLikes) likedUsers.push(like.userEmail);
                }

                if (range) {
                    let users = await prisma.user.findMany({
                        where: {
                            email: { not: event.hostEmail },
                            likes: {
                                every: {
                                    userEmail: { notIn: likedUsers }
                                }
                            }
                        },
                        include: {
                            profile: {
                                include: {
                                    images: true
                                }
                            },
                        },
                        skip: min,
                        take: max,
                    });
                    let filtered = [];
                    for (let user of users) {

                        //Flip LatLgn to LngLat because google and Turf use opposing storage methods
                        if (user?.profile) {
                            if (getWithinRange(
                                [user.profile.geoLocation[1], user.profile.geoLocation[0]],
                                [event?.geoLocation[1], event.geoLocation[0]],
                                range)) {
                                const currEvent = exclude(user, ["createdAt"]);
                                filtered.push(currEvent);
                            }
                        }
                    }
                    const results = filtered.slice(min, max);
                    return results;
                } else {
                    let users = await prisma.user.findMany({
                        where: {
                            hostEmail: { not: res.locals.user.email },
                            likes: {
                                every: {
                                    userLikes: { notIn: likedUsers }
                                }
                            }
                        },
                        include: {
                            profile: {
                                images: true
                            },
                        },
                        skip: min,
                        take: max,
                    });
                    const results = excludeFromAll(users, ["createdAt"]);
                    return results;
                }
            } catch (err) {
                console.log(err);
                throw err;
            }
        } else {
            try {
                let users = await prisma.user.findMany({
                    include: {
                        profile: {
                            include: {
                                images: true
                            }
                        },
                    },
                    skip: min,
                    take: max,
                });
                const results = excludeFromAll(users, ["createdAt"]);
                return results;
            } catch (err) {
                throw handlePrismaError(err);
            }
        }
    };


    /** patch user with data.
     *
     * Returns {isAdmin, email, firstName, lastName, lastLogin, phoneNumber}
    *
    * Throws NotfoundError on no user.
    **/
    static async patch(body) {
        let user = null;
        const { newPassword, email, password } = body;

        try {
            user = await prisma.user.findUniqueOrThrow({
                where: { email }
            });
        } catch (err) { throw new NotFoundError("user not found."); }

        try {
            if (body.newPassword) {
                user = await User.updatePassword({ newPassword, password, user });
            }
        } catch (err) { throw err; }

        try {
            let data = {};
            let update = false;
            for (let key of ["firstName", "lastName", "phoneNumber"]) {
                if (body[key] || body[key] === null) {
                    data[key] = body[key];
                    update = true;
                }
            }
            if (update) {
                user = await prisma.user.update({
                    where: { email },
                    data,
                    include: {
                        profile: {
                            include: {
                                images: true
                            }
                        },
                        events: true,
                    }
                });
            }
        } catch (err) { throw new handlePrismaError(err); }
        console.log(user);
        return user;
    };


    /** authenticate - {primary**email or phoneNumber**, inputPassword}
     * 
     * authenticates a email/phone and password
     * 
     * Returns {isAdmin, email, firstName, lastName, lastLogin, phoneNumber}
     * 
     * Throws NotFound error on missing email/phone.
     * Throws Bad error on missing profile.
     */
    static async authenticate(primary, inputPassword) {
        let user = null;
        let type = null;

        if (primary.includes("@")) {
            type = "email";
            try {
                user = await prisma.user.findUniqueOrThrow({
                    where: { email: primary, },
                });
            } catch (err) {
                throw new NotFoundError(`No account with email ${ primary }.`);
            };

        } else {
            type = "phone";
            try {
                user = await prisma.user.findUniqueOrThrow({
                    where: { phoneNumber: primary, },
                });
            } catch (err) {
                throw new NotFoundError(`No account with phone number ${ primary }.`);
            };
        };

        if (user) {
            const valid = await bcrypt.compare(inputPassword, user.password);
            if (valid) {
                delete user.password;
                try {
                    prisma.user.update(
                        {
                            where: { email: user.email, },
                            data: { lastLogin: moment.utc() }
                        }
                    );
                } catch (err) {
                    throw handlePrismaError(err);
                }

                return user;
            }
        }
        throw new UnauthorizedError(`Invalid ${ type } or password.`);
    }


    /** Register user with data.
   *
   * Returns {isAdmin, email, firstName, lastName, lastLogin, phoneNumber}
   *
   * Throws BadRequestError on duplicates.
   **/
    static async register(userInfo) {
        const duplicateCheck = await prisma.user.findMany({
            where: {
                OR: [
                    { email: userInfo.email, },
                    { phoneNumber: userInfo.phoneNumber }
                ]
            }
        });

        if (duplicateCheck.length) throw new
            BadRequestError('Email or phone number are already registered.');

        const hashedPassword = await bcrypt.hash(userInfo.password, BCRYPT_WORK_FACTOR);
        try {
            const user = await prisma.user.create({
                data: {
                    isAdmin: false,
                    email: userInfo.email,
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    password: hashedPassword,
                    phoneNumber: userInfo.phoneNumber
                }
            });

            delete user.password;
            return user;
        } catch (err) { throw handlePrismaError(err); }
    }


    /** Create user profile with data.
     *
     * Returns { age, bio, gender, email }
     *
     * Throws BadRequestError on existing profile for user
     **/
    static async createProfile(data) {
        const { email, age, bio, gender, city, state, geoLocation, images, range } = data;

        const duplicateCheck = await prisma.profile.findUnique({
            where: { email }
        });
        if (duplicateCheck) {
            console.warn("DUP", duplicateCheck);
            throw new BadRequestError('Profile for this account please update.');
        }

        try {

            const FormattedImages = prepImages(images, email);

            const profile = await prisma.profile.create({
                data: {
                    email,
                    age,
                    bio,
                    gender,
                    city,
                    state,
                    geoLocation,
                    range,
                    images: { create: FormattedImages },
                },
                include: {
                    images: true,
                    user: {
                        select: {
                            isAdmin: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phoneNumber: true,
                        }
                    }
                }
            });
            return profile;
        } catch (err) {
            console.warn(err);
            throw handlePrismaError(err);
        };
    }


    /** Patch user profile with data.
   *
   * Returns {  age, bio, gender, email ,{user} }
   *
   * Throws BadRequestError on not found user.
   **/
    static async patchProfile(data) {
        let profile = null;
        const { email, age, gender, geoLocation, bio, city, state, images, range } = data;

        try {
            profile = await prisma.profile.findUniqueOrThrow({
                where: { email }
            });
        } catch (err) { throw new NotFoundError("user profile not found."); }

        const profileData = { age, gender, geoLocation, bio, city, state, range };

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
        }


        if (images) {
            const FormattedImages = prepImages(images, email);
            profileData.images = {
                create: FormattedImages
            };
        }
        try {
            profile = await prisma.profile.update({
                where: { email },
                data: profileData,
                include: {
                    user: {
                        select: {
                            isAdmin: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phoneNumber: true,
                        }
                    },
                    images: true
                }
            });
        } catch (err) { throw new handlePrismaError(err); }

        return profile;
    };


    /** return signed JWT {email, phoneNumber, isAdmin} from user data. */
    static createToken(user) {
        console.assert(user.isAdmin !== undefined,
            "createToken passed user without isAdmin property.");

        let payload = {
            email: user.email,
            phoneNumber: user.phoneNumber || null,
            isAdmin: user.isAdmin || false,
        };

        return jwt.sign(payload, SECRET_KEY, JWTOPTIONS);
    }

}

module.exports = User;