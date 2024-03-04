const turf = require('@turf/turf');

/** Determines if point is within given radius of origin point. Returns true or false */
function getWithinRange(point, geoLocation, distance) {
    const origin = turf.point(geoLocation);
    point = turf.point(point);

    const range = turf.circle(origin, distance, { steps: 32, units: "miles" });
    return turf.booleanPointInPolygon(point, range.geometry);
};

module.exports = { getWithinRange };