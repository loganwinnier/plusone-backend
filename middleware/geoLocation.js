const fetch = require('node-fetch');
const { GEOCODING_KEY } = require('../config');

/**Determining locations of user with city and state and longitude 
 * and latitude.  
 * 
 * Takes a city and state and coverts it to longitude and latitude for database
 * insertion or longitude and latitude and converts to city and state.
 * 
 * 
 * Appends geoLocation, state and city onto res.locals.location.
 */
async function geoCode(req, res, next) {
    const formData = res.locals.formData;

    if (req.method === "PATCH"
        && !formData?.city
        && !formData?.state
        && !formData?.longitude
        && !formData?.latitude
    ) return next();

    if (formData?.city && formData?.state) {
        try {
            let formattedCity = formData?.city.replaceAll(" ", "%20");
            let formattedState = formData?.state.replaceAll(" ", "%20");
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${ formattedCity }%20${ formattedState }&key=${ GEOCODING_KEY }&result_type=locality|administrative_area_level_1`);

            jsonified = await response.json();
        } catch (error) {
            return res.status(500).json({ error: ["Failed to fetch"] });
        };

        if (jsonified.error_message) {
            return res.status(401).json({ error: [jsonified.error_message] });
        }
        if (jsonified.status === 'ZERO_RESULTS') {
            return res.status(401).json({ error: ["Location not found"] });
        }

        const { lat, lng } = jsonified.results[0].geometry.location;
        const address = jsonified?.results[0]?.address_components;
        try {
            const city = address.find(element => element.types[0] === 'locality');
            const state = address.find(element => element.types[0] === 'administrative_area_level_1');
            const location = {
                geoLocation: [lat, lng],
                city: city.long_name,
                state: state.long_name
            };
            res.locals.location = { ...location };
            return next();
        } catch (err) {
            return res.status(401).json({ error: ["Location not found"] });
        }

    }
    if (formData?.longitude && formData?.latitude) {

        try {
            const longitude = Number.parseFloat(formData.longitude);
            const latitude = Number.parseFloat(formData.latitude);
            console.log(longitude, latitude);

            response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${ latitude },${ longitude }&key=${ GEOCODING_KEY }&result_type=locality|administrative_area_level_1`);

            jsonified = await response.json();
        } catch (error) {
            return res.status(500).json({ error: ["Failed to fetch"] });
        };
        if (jsonified.error_message) {
            return res.status(401).json({ error: [jsonified.error_message] });
        }
        if (jsonified.status === 'ZERO_RESULTS') {
            return res.status(401).json({ error: ["Location not found"] });
        }

        const address = jsonified?.results[0]?.address_components;
        const city = address.find(element => element.types[0] === 'locality');
        const state = address.find(element => element.types[0] === 'administrative_area_level_1');
        const location = {
            geoLocation: [lat, lng],
            city: city.long_name,
            state: state.long_name
        };


        res.locals.location = { ...location };
        return next();
    }
    return res.status(401).json({ error: ["city/state or longitude/latitude Required"] });

}

module.exports = { geoCode }

