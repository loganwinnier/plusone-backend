"use strict";

/** Routes for matches. */

const express = require("express");
const {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUserOrAdminLikes,
} = require("../middleware/auth");
const { validateLike } = require("../middleware/validation");
const { prisma } = require("../prisma");
const { Like } = require("../models/like");
const router = express.Router();


/** POST / { like }  => { like }
 * 
 * If liking user as event:
 * Takes a body like {eventId: } and param of user being liked's email.
 * 
 * If liking event as user:
 * Takes param of event being liked.
 * 
 * Adds a new like makes chat if applicable. 
 *
 * This returns the newly created like or chat.
 *
 * Returns errors in array format {error: [ {error}, {error} ]}
 * 
 * Authorization required: signed-in
 **/
router.post(
    "/:id", authenticateJWT, ensureCorrectUserOrAdminLikes, validateLike,
    async function (req, res, next) {

        if (res.locals.errors) return res.status(400).json(
            { error: res.locals.errors.map(err => err.message.replaceAll("\"", "")) });

        try {
            let like = null;
            if (req.body?.eventId) {
                like = await Like.createOrAdd(req.params?.id, req.body.eventId);
            } else {
                like = await Like.createOrAdd(res.locals.user, req.params?.id);
            }
            return res.status(201).json(like);
        } catch (err) {
            return res.status(400).json({ error: [err.message] });
        }
    });

/** GET / { like }  => [like, like, ...]
 * 
 * gets all likes for current user,
 * 
 * Authorization required: signed-in
 *  
**/
router.get(
    "/", authenticateJWT, ensureLoggedIn,
    async function (req, res, next) {

        try {
            const likes = await prisma.user.findUniqueOrThrow({
                where: { email: res.locals.user.email },
                select: { likes: true }
            });
            return res.status(201).json(likes);
        } catch (err) {
            return res.status(400).json({ error: [err.message] });
        }
    });


module.exports = router;