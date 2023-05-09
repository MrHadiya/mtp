// const isset = require("isset");
// const config = require("../../config/config");
// var randomstring = require("randomstring");
// All Controller
const moment = require('moment');
// const { fileValidationFunction, encode, uploadMaterialToAWS, uploadExcelToAWS, sendEmailToUser, sendEmailToAdmin } = require('../../helper/common_functions');
const settingsModel = require('../../model/settings_model');
const { sendOTPEmail } = require('../../helper/common_functions');
const curruntTime = moment(new Date()).format('YYYY-MM-DD hh:mm:00')
// const readXlsxFile = require("read-excel-file/node");
// const excelJS = require("exceljs");



module.exports.contactUs = async (request, response) => {
    try {
        const { name, email, message } = request.body;

        var insert_data = { 'name': name, 'email': email, 'message': message, 'created_at': curruntTime, 'status': 1 }
        const addData = await settingsModel.insertContactUSData(insert_data);
        if (!addData.status) return response.json({ status: false, message: addData.message });


        var subject = "Thanks for contacting..."
        var html = "<h1>Hello, </h1>" +
            "<p>Thank you so much for contacting us. We value your thoughts and we strive to provide you with the best user experience possible.</p>" +
            "<p>We read every message and typically respond within 48 hours if a reply is required.</p>" +
            "<p>Thanks. </p>";
        const sendOTP = await sendOTPEmail(email, subject, html)
        if (!sendOTP.status) return response.json({ status: false, message: sendOTP.message });

        return response.json({ status: true, message: "Thanks for contacting us! We will be in touch with you shortly." });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}
























