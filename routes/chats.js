"use strict";

/** Routes for matches. */

const express = require("express");
const {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUserOrAdminChats,
} = require("../middleware/auth");
const { prisma } = require("../prisma");
const { Chat } = require("../models/chat");

const router = express.Router();

/** GET / => { matches: [{id, user, event}, ... ] }
 *
 *  Returns list of all chats where user is member.
 * Filter For pagination
 *
 * Authorization required: Correct Chat user
 **/
router.get("/", authenticateJWT, ensureCorrectUserOrAdminChats, async function (req, res, next) {
    const min = req.query?.min ? Number(req.query.min) : undefined;
    const max = req.query?.max ? Number(req.query.max) : undefined;
    try {
        const chats = await Chat.getAll(res.locals.user, min, max);
        return res.json({ chats });
    } catch (err) { return res.status(400).json({ error: [err.message] }); }
});

router.get("/:id", authenticateJWT, ensureCorrectUserOrAdminChats, async function (req, res, next) {

    try {
        const chat = await prisma.chat.findUniqueOrThrow({
            where: { id: req.params.id },
            include: {
                messages: true,
                userOne: { select: { profile: { select: { images: true } } } },
                userTwo: { select: { profile: { select: { images: true } } } },
                associatedEvents: { include: { images: true } }
            }
        });

        return res.json({ chat });
    } catch (err) {
        console.warn(err);
        return res.status(400).json({ error: [err.message] });
    }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same-user-as-:email
 **/
router.delete("/:id", authenticateJWT,
    ensureCorrectUserOrAdminChats,
    async function (req, res, next) {

        try {
            let chat = await prisma.chat.findUniqueOrThrow({
                where: { id: req.params.id },
            });

            await prisma.chat.delete({
                where: { id: req.params.id },
            });
            return res.json({ deleted: req.params.id });
        } catch (err) { return res.status(500).json({ error: ["failed to delete match."] }); }
    });



module.exports = router;