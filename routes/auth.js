"use strict";

/** Routes for authentication. */

const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const { BadRequestError } = require("../expressError");
const { validateRegister, validateLogin } = require("../middleware/validation");
const { geoCode } = require("../middleware/geoLocation");


/** POST /auth/login:  {email/phoneNumber , password } => { token }
 * 
 * login is the primary form for auth email/phone-number since optional
 * choice.
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Returns errors in array format {error: [ {error}, {error} ]}
 * 
 * Authorization required: none
 */
router.post("/login", validateLogin, async function (req, res, next) {
    if (res.locals.errors) return res.status(400).json(
        { error: res.locals.errors.map(err => err.message.replaceAll("\"", "")) });

    const password = req.body.password;
    const primary = req.body.email ? req.body.email : req.body.phoneNumber;
    if (!primary) return res.status(400).json({ error: new BadRequestError("email or phone required.") });

    try {
        const user = await User.authenticate(primary, password);
        const token = User.createToken(user);

        return res.json({ token });
    } catch (err) {
        console.log(err);
        return res.status(err.status).json({ error: [err.message] });
    }
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { email, password, firstName, lastName, phoneNumber }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 * 
 * Returns errors in array format {error: [ {error}, {error} ]}
 * 
 * Making admins not allowed with this route. Use users route
 */
router.post("/register", validateRegister, async function (req, res, next) {
    if (res.locals.errors) return res.status(400).json(
        { error: res.locals.errors.map(err => err.message.replaceAll("\"", "")) });

    try {
        const newUser = await User.register(res.locals.data);
        const token = User.createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        console.warn(err)
        return res.status(err.status).json({ error: [err.message] });
    }
});


module.exports = router;