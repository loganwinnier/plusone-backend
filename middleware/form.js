const { formidable } = require("formidable");


/** Parses form Data from request and separates it into res.locals.formData and
 * Images for files
 * 
 * returns next
 */
function parseForm(req, res, next) {
    let parsed = {};

    if (Object.keys(req.body).length) {
        return res.status(400).json({ error: ["Data should be passed as form data."] });
    }

    let options = {
        maxFileSize: 100 * 1024 * 1024, //100 MBs converted to bytes,
    };
    const form = formidable(options);
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.warn(err);
                return res.status(400).json({ error: ["Could not parse form data."] });
            }
            console.log(fields, files);
            if (!Object.keys(fields).length && !files.length) {
                return res.status(400).json({ error: ["Form is empty"] });
            }

            for (let field in fields) {
                if (field === "removeImages") {
                    if (fields[field][0] === "") {
                        parsed[field] = [];
                    } else {
                        let formatted = fields[field][0].split(",");
                        parsed[field] = formatted;
                    }
                } else {
                    parsed[field] = fields[field][0];
                }
            }

            res.locals.formData = parsed;
            res.locals.images = files;
            return next();
        });
    } catch (err) {
        console.warn("Parse Failed", err);
    }
}

module.exports = { parseForm };