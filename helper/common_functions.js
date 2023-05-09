var express = require("express");
var CryptoJS = require("crypto-js");
var path = require("path");
const secretKey = 'abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcba';
const nodemailer = require("nodemailer");
const AWS = require('aws-sdk');
const randomstring = require("randomstring");


module.exports.sendOTPEmail = async (email, subject, html) => {
    return new Promise(async resolve => {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",//or "gmail"
            port: 465,//optional
            secure: true,//optional
            auth: {
                user: "vipul.onus@gmail.com",
                pass: "pnramzzuvyixbxor"
            }
        });
        var mailOptions = {
            from: "tvipul.onus@gmail.com",
            to: email,
            subject: subject,
            html: html
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error" + error)
                return resolve({ status: false, data: [], message: 'Could not send OTP!' });
            }

            console.log("info " + info)
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return resolve({ status: true, data: [], message: 'OTP sent!.' });
        });


    });
}

module.exports.uploadMaterialToAWS = (fileData, path) => {
    return new Promise(resolve => {
        const acceptFiles = ['image/svg', 'image/svg+xml', 'image/png', 'image/x-citrix-png', 'image/x-png', 'image/jpg', 'image/jpeg', 'image/x-citrix-jpeg', 'image/bmp'];
        const allowedExtension = ['png', 'jpg', 'jpeg', 'svg'];

        const fileExt = fileData.name.split('.')[fileData.name.split('.').length - 1].toLowerCase()
        // var fileName = fileData.name
        const contentType = fileData.mimetype
        const ContentEncoding = fileData.encoding
        const fileSize = fileData.size
        const fileNameAWS = randomstring.generate({ length: 20, charset: 'numeric' }) + '.' + fileData.name.split(" ").join("-");
        const sizeLimit = 2 * 1024 * 1024;
        console.log(contentType,'---------contentType');
        console.log(fileExt,'---------fileExt');
        if (fileSize > sizeLimit) return resolve({ status: false, message: "File must be smaller than 2MB." });
        if (!acceptFiles.includes(contentType) || !allowedExtension.includes(fileExt)) return resolve({ status: false, message: "Only accept image as upload picture." });

        AWS.config.update({
            accessKeyId: process.env.AWS_S3_ACCESSKEYID,
            secretAccessKey: process.env.AWS_S3_SECRETKEY,
            region: process.env.AWS_S3_REGION
        });

        const awsKey = 'content/' + path + fileNameAWS

        const s3 = new AWS.S3();
        const fileContent = Buffer.from(fileData.data, 'binary');

        // Setting up S3 upload parameters
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: awsKey, // File name you want to save as in S3
            Body: fileContent,
            ContentEncoding: ContentEncoding,
            ContentType: contentType
        };

        s3.upload(params, function (err, data) {
            if (err) return resolve({ status: false, message: "Errow while uploading image on s3." });
            console.log(data.key);
            return resolve({ status: true, data: data.key });
        });

    });
}

module.exports.deleteMaterialFromAWS = (path) => {
    return new Promise(resolve => {

        AWS.config.update({
            accessKeyId: process.env.AWS_S3_ACCESSKEYID,
            secretAccessKey: process.env.AWS_S3_SECRETKEY,
            region: process.env.AWS_S3_REGION
        });

        const s3 = new AWS.S3();
        const params = { Bucket: process.env.AWS_S3_BUCKET, Key: path };

        s3.deleteObject(params, function (err, data) {
            if (err) return resolve({ status: false, message: "Errow while delete image from server." });
            return resolve({ status: true });
        });

    });
}
