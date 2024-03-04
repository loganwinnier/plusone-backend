"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { prisma } = require("../prisma");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the email, phone and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
async function authenticateJWT(req, res, next) {
    const authHeader = req.headers?.authorization;
    if (authHeader) {
        const token = authHeader.replace(/^[Bb]earer /, "").trim();
        try {
            let user = jwt.verify(token, SECRET_KEY);
            res.locals.user = await prisma.user.findUniqueOrThrow({
                where: { email: user.email },
                include: {
                    events: true,
                    profile: {
                        select: {
                            geoLocation: true,
                            images: true
                        }
                    },
                    likes: true,
                    chatsUserOne: true,
                    chatsUserTwo: true,
                }
            });
        } catch (err) {
            /* ignore invalid tokens (but don't store user!) */
            console.log(err);
        }
    }
    return next();

}


/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
function ensureLoggedIn(req, res, next) {
    if (res.locals.user?.email) return next();
    return res.status(401).json({ error: ["Failed to authenticate user."] });
}


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */
function ensureAdmin(req, res, next) {
    if (res.locals.user?.email && res.locals.user?.isAdmin === true) {
        return next();
    }
    return res.status(401).json({ error: ["Failed to authenticate user."] });
}


/** Middleware to use when they must provide a valid token & be user matching
 *  email provided as route param.
 *
 *  If not, raises Unauthorized.
 */
function ensureCorrectUserOrAdmin(req, res, next) {
    const user = res.locals.user;
    const email = res.locals.user?.email;
    if (email && (email === req.params.email || user.isAdmin === true)) {
        return next();
    }

    return res.status(401).json({ error: ["Failed to authenticate user."] });
}


/** Middleware to use when they must provide a valid token & be user matching
 *  email provided as route param.
 *
 *  If not, raises Unauthorized.
 */
async function ensureCorrectUserOrAdminEvents(req, res, next) {
    const user = res.locals.user;
    let event = user?.events?.find(evt => evt.eventId === req.params?.id);

    if (!event) {
        return res.status(404).json(
            { error: ["Event does not exist or is not created by this user."] });
    }

    const email = event.hostEmail || null;
    if ((email && user) && (email === user.email || user.isAdmin === true)) {
        return next();
    }

    return res.status(401).json({ error: ["Failed to authenticate user."] });
};


/** Middleware to use when they must provide a valid token & be user matching
 *  email provided as route param.
 *
 *  If not, raises Unauthorized.
 */
async function ensureCorrectUserOrAdminLikes(req, res, next) {
    const user = res.locals?.user;
    if (!user) return res.status(401).json({ error: ["Failed to authenticate user."] });
    if (user.email === req.params?.id) {
        return res.status(400).json(
            { error: ["cannot Like self"] });
    };

    if (user.events.find(evt => evt.eventId === req.params?.id)) {
        return res.status(400).json(
            { error: ["cannot Like own event"] });
    };

    if (req.body?.eventId) {
        let event = user.events.find(evt => evt.eventId === req.body?.eventId);
        if (!event) {

            return res.status(400).json(
                { error: ["Must be event host to like user or event does not exist."] });
        };
    }

    return next();
};

/** Middleware to use when they must provide a valid token & user must be member
 * of chat..
 *
 *  If not, raises Unauthorized.
 */
async function ensureCorrectUserOrAdminChats(req, res, next) {
    const user = res.locals?.user;
    if (!user) return res.status(401).json({ error: ["Failed to authenticate user."] });

    if (user.isAdmin) return next();
    if (req?.params.id) {
        let chat = user.chats.find(cht => cht.id === req.params.id);

        if (!chat) {
            return res.status(404).json(
                { error: ["Chat does not exist or user is not member of this chat."] });
        }
    }

    return next();
}


module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin,
    ensureCorrectUserOrAdminEvents,
    ensureCorrectUserOrAdminLikes,
    ensureCorrectUserOrAdminChats
};