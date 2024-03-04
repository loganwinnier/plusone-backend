"use strict";

/** Routes for profiles. */

const express = require("express");
const cors = require("cors");
const {
    ensureCorrectUserOrAdmin,
    authenticateJWT,
    ensureLoggedIn,
} = require("../middleware/auth");
const { validateProfile } = require("../middleware/validation");
const User = require("../models/user");
const { geoCode } = require("../middleware/geoLocation");
const { uploadImages } = require("../middleware/images");
const { parseForm } = require("../middleware/form");

const router = express.Router();


/** POST / { profile }  => { profile }
 *
 * Adds a new profile. 
 *
 * This returns the newly created profile.
 *
 * Returns errors in array format {error: [ {error}, {error} ]}
 * 
 * Authorization required: signed-in
 **/
router.post("/",
    authenticateJWT,
    ensureLoggedIn,
    parseForm,
    geoCode,
    validateProfile,
    uploadImages,
    async function (req, res, next) {
        if (res.locals.errors) return res.status(400).json(
            { error: res.locals.errors.map(err => err.message.replaceAll("\"", "")) });

        try {
            const profile = await User.createProfile({
                ...res.locals.data,
                ...res.locals.user,
                images: res.locals.images
            });
            return res.status(201).json({ profile });
        } catch (err) {
            console.warn(err);
            return res.status(err.status).json({ error: [err.message] });
        }
    });


/** PATCH /[id] { profile } => { profile }
 *
 * Data can include:
 *   { age, bio, gender }
 *
 * Returns Json like {profile: { age, bio, gender, email, {user} }
 *
 * Authorization required: admin or same-user-as-:email
 **/
router.patch("/:email",
    authenticateJWT,
    ensureCorrectUserOrAdmin,
    parseForm,
    geoCode,
    validateProfile,
    uploadImages,
    async function (req, res, next) {
        if (res.locals.errors) return res.status(400).json(
            { error: res.locals.errors.map(err => err.message.replaceAll("\"", "")) });

        try {
            let profile = await User.patchProfile({
                ...res.locals.data,
                email: req.params.email,
                images: res.locals.images
            });
            return res.json({ profile });
        } catch (err) {
            console.log(err);
            return res.status(err.status).json({ error: [err.message] });
        }
    });

module.exports = router;