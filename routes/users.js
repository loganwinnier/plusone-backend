"use strict";

/** Routes for users. */

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin, authenticateJWT, ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/user");
const { validateRegister, validateUserUpdate } = require("../middleware/validation");
const { prisma } = require("../prisma");
const { exclude } = require("../helpers/prisma");
const { handlePrismaError } = require("../expressError");

const router = express.Router();


/** POST / { user }  => { token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  { token: token }
 *
 * Returns errors in array format {error: [ {error}, {error} ]}
 * 
 * Authorization required: admin
 **/
router.post("/",
    authenticateJWT,
    ensureAdmin,
    validateRegister, async function (req, res, next) {
        if (res.locals.errors) return res.status(400).json(
            { error: res.locals.errors.map(err => err.message.replaceAll("\"", "")) });
        try {

            const newUser = await User.register(res.locals.data);

            if (req.body.isAdmin) newUser.isAdmin = true;
            const token = User.createToken(newUser);

            return res.status(201).json({ token });
        } catch (err) {
            return res.status(err.status).json({ error: [err.message] });
        }
    });


/** GET / => { users: [ {email, firstName, lastName, phoneNumber }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/
router.get("/", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
    const min = req.query?.min ? Number(req.query.min) : 0;
    const max = req.query?.max ? Number(req.query.max) - min : 100 - min;
    const range = req.query?.range ? Number(req.query.range) : null;
    const eventId = req?.query?.eventId ? req?.query?.eventId : null;

    try {
        let users = await User.getUsers(eventId, min, max, range);
        return res.json({ users });
    } catch (err) {
        return res.status(err.status).json({ error: err.message });
    }

});


/** GET /[email] => { user }
 *
 * Returns { email, firstName, lastName, phoneNumber, isAdmin }
 *  
 *
 * Authorization required: logged in
 **/
router.get("/:email", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
    try {
        if (res.locals.user.email === req.params.email) {
            let user = await prisma.user.findUniqueOrThrow({
                where: { email: req.params.email },
                include: {
                    profile: {
                        include: {
                            images: true
                        }
                    },
                    events: {
                        include: {
                            images: true
                        }
                    },
                    chatsUserOne: true,
                    chatsUserTwo: true,
                }
            });
            user = exclude(user, ["password", "createdAt"]);
            return res.json(user);
        } else {
            let user = await prisma.user.findUniqueOrThrow({
                where: { email: req.params.email },
                include: {
                    profile: {
                        include: {
                            images: true
                        }
                    },
                    events: {
                        include: {
                            images: true
                        }
                    },
                }
            });
            user = exclude(user, ["password", "createdAt"]);
            return res.json(user);
        }
    } catch (err) {
        handlePrismaError(err);
        return res.status(404).json({ error: ["user not found."] });
    }
});


/** PATCH /[email] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, newPassword, email, phoneNumber }
 *
 * Returns { phoneNumber, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:email
 **/
router.patch("/:email", authenticateJWT, ensureCorrectUserOrAdmin, validateUserUpdate,
    async function (req, res, next) {
        if (res.locals.errors) return res.status(400).json(
            { error: res.locals.errors.map(err => err.message.replaceAll("\"", "")) });

        try {
            req.body.email = req.params.email;
            let user = await User.patch(req.body);
            user = exclude(user, ["password", "createdAt"]);
            return res.json({ user });
        } catch (err) { return res.status(err.status).json({ error: [err.message] }); }
    });


/** DELETE /[email]  =>  { deleted: email }
 *
 * Authorization required: admin or same-user-as-:email
 **/
router.delete("/:email", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        await prisma.user.findUniqueOrThrow({ where: { email: req.params.email } });
    } catch (err) { return res.status(404).json({ error: ["user does not exist."] }); };

    try {
        await prisma.user.delete({ where: { email: req.params.email } });
        return res.json({ deleted: req.params.email });
    } catch (err) { return res.status(500).json({ error: ["failed to delete user."] }); }
});

module.exports = router;