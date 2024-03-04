"use strict";

/** Common functions for prisma query data . */

/** takes object and array of keys in object.
 * 
 *  removes keys from object and returns new obj.
  */
function exclude(obj, keys) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key))
    );
}


/** takes an array of objects and array of keys in object.
 * 
 *  removes keys from objects and returns array of filtered objects.
  */
function excludeFromAll(objs, keys) {
    let filteredObjs = [];
    for (let obj of objs) {
        filteredObjs.push(exclude(obj, keys));
    }
    return filteredObjs;
}

/** Preps images for adding to database.
 * 
 * takes array of images and users email.
 * 
 * returns array of data
 */
function prepImages(images, email) {
    const data = [];
    for (let url of images) {
        data.push({ url, userEmail: email });
    }
    return data;
}

module.exports = { exclude, excludeFromAll, prepImages };