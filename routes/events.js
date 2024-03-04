"use strict";

/** Routes for events. */

const express = require("express");
const {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUserOrAdminEvents,
} = require("../middleware/auth");
const { validateEvent } = require("../middleware/validation");
const { prisma } = require("../prisma");
const { excludeFromAll, exclude } = require("../helpers/prisma");
const Event = require("../models/event");
const { geoCode } = require("../middleware/geoLocation");
const { getWithinRange } = require("../helpers/rangeFinder");
const router = express.Router();
const { parseForm } = require("../middleware/form");
const { uploadImages } = require("../middleware/images");

/** POST / { event }  => { token }
 *
 * Adds a new event. 
 *
 *  { event: { id, title, geoLocation, city, state, dateTime, description, payment, hostEmail }}
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
    validateEvent,
    uploadImages,
    async function (req, res, next) {
        if (res.locals.errors) return res.status(400).json(
            { error: res.locals.errors.map(err => err.message.replaceAll("\"", "")) });

        try {
            const event = await Event.create({
                ...res.locals.data,
                user: { ...res.locals.user },
                images: res.locals.images
            });

            return res.status(201).json({ event });
        } catch (err) {
            console.log(err);
            return res.status(err.status).json({ error: [err.message] });
        }
    });


/** GET / => {event, event, ...}
 * Accepts query of min, max: default 0 , 100 
 * 
 * Returns Json like: { events: [{ id, title, dateTime, description, payment, hostEmail }, {event}, ...}]
 *
 * Authorization required: signed-in
 **/
router.get("/", authenticateJWT, ensureLoggedIn, async function (req, res, next) {
    const min = req.query?.min ? Number(req.query.min) : 0;
    const max = req.query?.max ? Number(req.query.max) - min : 100 - min;
    const range = req.query?.range ? Number(req.query.range) : null;

    try {
        let events = await Event.getEvents(res.locals.user, min, max, range);
        return res.json({ events });
    } catch (err) {
        return res.status(err.status).json({ error: err.message });
    }
});


/** GET /[id] => { event }
 *
 * Returns Json like: { event: { id, title, dateTime, description, payment, host }}
 *  
 *
 * Authorization required: signed-in
 **/
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        let event = await prisma.event.findUniqueOrThrow({
            where: { eventId: req.params.id }
        });
        event = exclude(event, ["createdAt"]);
        return res.json({ event });
    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: ["event not found."] });
    }
});


/** PATCH /[id] { event } => { event }
 *
 * Data can include:
 *   { title, dateTime, description, payment,  }
 *
 * Returns Json like: { event: { id, geolocation, city, state, title, dateTime, description, payment, hostEmail }}
 *
 * Authorization required: admin or same-user-as-guest-or-eventHost:email
 **/
router.patch("/:id",
    authenticateJWT,
    ensureCorrectUserOrAdminEvents,
    parseForm,
    geoCode,
    validateEvent,
    uploadImages,
    async function (req, res, next) {
        if (res.locals.errors) return res.status(400).json(
            { error: res.locals.errors.map(err => err.message.replaceAll("\"", "")) });

        try {
            let event = await Event.patch({
                ...res.locals.data,
                images: res.locals.images,
                user: res.locals.user
            }, req.params.id);
            event = exclude(event, ["createdAt"]);
            return res.json({ event });
        } catch (err) {
            console.log(err);
            return res.status(err.status).json({ error: [err.message] });
        }
    });


/** DELETE /[id]  =>  { deleted: title }
 *
 * Returns JSON like: {deleted: "id"}
 * 
 * Authorization required: admin or same-user-as-guest-or-eventHost:email
 **/
router.delete("/:id", authenticateJWT, ensureCorrectUserOrAdminEvents, async function (req, res, next) {
    try {
        await prisma.event.findUniqueOrThrow({ where: { eventId: req.params.id } });
    } catch (err) { return res.status(404).json({ error: ["event does not exist."] }); };

    try {
        const resp = await prisma.event.delete({
            where: { eventId: req.params.id },
            include: {
                host: {
                    include: {
                        events: {
                            where: { eventId: { not: req.params.id } },
                            include: { images: true }
                        },
                    }
                }
            }
        });
        return res.status(202).json({
            deleted: req.params.id,
            events: resp.host.events
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: ["failed to delete event."] });
    }
});

module.exports = router;