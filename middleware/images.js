const AWS = require("@aws-sdk/client-s3");
const { AWS_S3_ACCESS_KEY, AWS_S3_SECRET_KEY, BUCKET_NAME } = require("../config");
const { v4: uuidv4 } = require('uuid');
const { BadRequestError } = require("../expressError");
const { formidable } = require("formidable");
const fs = require('fs');

const s3 = new AWS.S3Client({
    region: "us-east-1",
    credentials : {
        secretAccessKey: AWS_S3_SECRET_KEY,
        accessKeyId: AWS_S3_ACCESS_KEY,
    }
});

class Bucket {
    /** Class for S3 Buckets */
    constructor(bucketName) {
        this.bucketName = bucketName;
    }

    /** Method for adding image to s3 bucket.
     * 
     * takes image data.
     */
    async post(data) {
        let read = fs.readFileSync(data.filepath);
        let command = new AWS.PutObjectCommand({
            Key: data.newFilename,
            Bucket: this.bucketName,
            ContentType: data.mimetype,
            Body: read,
        });
        try {
            await s3.send(command);
            return data.newFilename;
        } catch (err) {
            console.log("ERR", err);
            throw err;
        }
    }

    /** Method for deleting image to s3 bucket.
     * 
     * takes image name in bucket.
     */
    async delete(name) {
        let command = new AWS.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: name,
        });
        try {
            const response = await s3.send(command);
            return response;
        } catch (err) {
            throw err;
        }
    }
}

/** Deletes array of images from s3 bucket.
 * 
 * takes an array of images and deletes them from s3 bucket. */
async function deleteImages(images) {
    let bucket = new Bucket(BUCKET_NAME);
    let uploadPromises = [];

    for (let image of images) {
        uploadPromises.push(bucket.delete(image));
    }

    await Promise.allSettled(uploadPromises)
        .catch(err => {
            return res.status(400).json({ error: err });
        });
}

/** Middleware that takes an array from res.locals.images and uploads to s3 .
 * bucket.
 * 
 * updates res.locals.images to array of image s3 keys.
 */
async function uploadImages(req, res, next) {
    console.log("IMAGES")
    const files = res.locals.images;

    if ((res.locals.user.profile?.images?.length || 0) - (
        res.locals.formData.removeImages?.length || 0) >= 6) {
        return res.status(400).json({ error: ["maximum of 6 images allowed for user."] });
    }

    let bucket = new Bucket(BUCKET_NAME);
    let uploadPromises = [];
    let images = [];

    for (let key in files) {
        uploadPromises.push(bucket.post(files[key][0]));
    }
    await Promise.all(uploadPromises).then(
        (result) => result.forEach((file) => (
            images.push(file)
        )))
        .catch(err => {
            return res.status(400).json({ error: err });
        });

    res.locals.images = images;
    next();
}

module.exports = { uploadImages, deleteImages };