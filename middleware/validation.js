"use strict";

/** Convenience  middleware to handle common validation cases in routes. */

const Joi = require('joi');
const { BadRequestError } = require('../expressError');
const moment = require('moment');


/** Validates request body for creation of user
 * 
 * sets  res.locals.body to validation result.
 * sets res.locals.errors if any
 * 
 */
function validateRegister(req, res, next) {

    const schema = Joi.object({
        email: Joi.string().min(5).max(64).email().lowercase().required(),
        firstName: Joi.string().trim().min(2).max(35).required(),
        lastName: Joi.string().trim().min(2).max(35).required(),
        password: Joi.string().trim().min(8).max(35).required(),
        phoneNumber: Joi
            .string()
            .pattern(/^[0-9]+$/, { name: "number" })
            .min(10)
            .max(15)
            .optional()
            .allow(null),
        isAdmin: Joi.any().optional(),
        newPassword: Joi.any().optional(),
    }).options({ abortEarly: false });

    const body = req.body;
    if (body.phoneNumber) body.phoneNumber.replace(/\D/g, '');
    const { error, value } = schema.validate(body);
    if (error) res.locals.errors = error.details;

    else res.locals.data = value;

    return next();
}


/** Validates request body for update of user
 * 
 * sets  res.locals.body to validation result.
 * sets res.locals.errors if any
 * 
 */
function validateUserUpdate(req, res, next) {

    const schema = Joi.object({
        firstName: Joi.string().trim().min(2).max(35),
        lastName: Joi.string().trim().min(2).max(35),
        password: Joi.string().trim().min(8).max(35).optional(),
        phoneNumber:
            Joi
                .string()
                .min(10)
                .max(15)
                .pattern(/^[0-9]+$/)
                .optional()
                .allow(null),
        newPassword: Joi.any().optional(),
    }).options({ abortEarly: false });

    const body = req.body;
    if (body.phoneNumber) body.phoneNumber.replace(/\D/g, '');
    const { error, value } = schema.validate(body);
    if (error) res.locals.errors = error.details;

    else res.locals.data = value;

    return next();
}


/** Validates request body for login of user
 * 
 * sets  res.locals.body to validation result.
 * sets res.locals.errors if any
 */
function validateLogin(req, res, next) {
    const body = req.body;

    const schema = Joi.object({
        email: Joi.string().min(5).max(64).email().lowercase(),
        phoneNumber: Joi.string().trim().min(10).max(15),
        password: Joi.string().trim().min(8).max(35),
    }).or('email', 'phoneNumber').options({ abortEarly: false });

    if (body.phoneNumber) body.phoneNumber.replace(/\D/g, '');
    const { error, value } = schema.validate(body);
    if (error) res.locals.errors = error.details;
    else res.locals.data = value;
    return next();
}


/** Validates request body for events
 * 
 * sets  res.locals.data to validation result.
 * sets res.locals.errors if any
 */
function validateEvent(req, res, next) {

    const schema = Joi.object({
        geoLocation: Joi.array().max(2).items(Joi.number()),
        city: Joi.string().trim().min(4).max(50),
        state: Joi.string().trim().min(4).max(40),
        title: Joi.string().trim().min(4).max(50),
        dateTime: Joi.date().required(),
        description: Joi.string().trim().max(250),
        payment: Joi.number().allow(null),
        images: Joi.array().max(6).items(Joi.any()),
        removeImages: Joi.array().max(6).items(Joi.string()).optional()
    }).options({ abortEarly: false });


    let data = { ...res.locals.formData };
    if (res.locals.location) {
        const { geoLocation, city, state } = res.locals.location;
        data.geoLocation = geoLocation;
        data.city = city;
        data.state = state;
        delete data.latitude;
        delete data.longitude;
    }

    try {
        if (data.dateTime) {
            const date = validateEventDate(data.dateTime);
            data.dateTime = date.toDate();
        };
    } catch (err) {
        throw err;
    }
    let { error, value } = schema.validate(data);
    if (error) res.locals.errors = error.details;
    else res.locals.data = value;

    return next();
}


/** Validates event dates
 * 
 * returns date as utc DateTime
 */
function validateEventDate(date) {
    let formattedDate = new Date(date);
    date = moment(formattedDate, true);
    let valid = date.isValid();
    if (!valid) throw new BadRequestError("Must be valid date.");

    let now = moment.utc();
    let momentDate = moment.utc(date);

    valid = momentDate.isAfter(now);
    if (!valid) throw new BadRequestError("date must be in the future.");
    valid = momentDate.isBefore(now.add(6, "M"));
    if (!valid) throw new BadRequestError("Events must be scheduled within the next six months.");

    console.log(momentDate);
    return momentDate;
}


/** Validates request body for matches
 * 
 * sets  res.locals.body to validation result.
 * sets res.locals.errors if any
 */
function validateLike(req, res, next) {

    const schema = Joi.object({
        eventId: Joi.string().optional()
    }).options({ abortEarly: false });

    const body = req.body;
    const { error, value } = schema.validate(body);
    if (error) res.locals.errors = error.details;

    else res.locals.data = value;

    return next();
}


/** Validates request body for profile
 * 
 * sets  res.locals.body to validation result.
 * sets res.locals.errors if any
 */
function validateProfile(req, res, next) {

    const schema = Joi.object({
        geoLocation: Joi.array().max(2).items(Joi.number()),
        city: Joi.string().trim().min(4).max(50),
        state: Joi.string().trim().min(4).max(40),
        age: Joi.number().min(0).max(110),
        bio: Joi.string().max(250),
        gender: Joi.string().max(20),
        range: Joi.number().max(100).min(0),
        images: Joi.array().max(6).items(Joi.any()),
        removeImages: Joi.array().max(6).items(Joi.string()).optional()
    }).options({ abortEarly: false });

    let data = { ...res.locals.formData };
    if (res.locals.location) {
        const { geoLocation, city, state } = res.locals.location;
        data.geoLocation = geoLocation;
        data.city = city;
        data.state = state;
        delete data.latitude;
        delete data.longitude;
    }

    const { error, value } = schema.validate(data);
    if (error) res.locals.errors = error.details;

    else res.locals.data = value;

    return next();
}

function validateMessage(req, res, next) {
    const schema = Joi.object({
        content: Joi.string().max(160).required()
    }).options({ abortEarly: false });

    let data = { ...req.body };
    const { error, value } = schema.validate(data);
    if (error) res.locals.errors = error.details;

    else res.locals.data = value;

    return next();
}

module.exports = {
    validateRegister,
    validateLogin,
    validateUserUpdate,
    validateEvent,
    validateEventDate,
    validateProfile,
    validateLike,
    validateMessage
};
