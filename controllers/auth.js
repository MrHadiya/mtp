const config = require("../config/config");
const JWTSecretKey = config.jwtsecretkey;
const jwtExpirySeconds = 60 * 60 * 24;
var jwt = require('jsonwebtoken');

const crypto = require('crypto');
var randomstring = require("randomstring");
const moment = require('moment');
const curruntTime = moment(new Date()).format('YYYY-MM-DD hh:mm:00')
// All Controller
const { sendOTPEmail } = require('../helper/common_functions');
const profilesModel = require('../model/profiles_model');

function hashPassword(password) {
    password = config.passwordSalt + password;
    var hash = crypto.createHash('sha1');
    hash.update(password);
    var value = hash.digest('hex');
    return value;
}

module.exports.signup = async (request, response) => {
    try {
        const { email, username, password, device_token, longitude, device_type, latitude } = request.body;

        const check_username = await profilesModel.checkUserName(username);
        if (!check_username.status) return response.json({ status: false, message: check_username.message });
        if (check_username.isExist) return response.json({ status: false, message: "User name already exist! Please try with different name." });

        const check_email = await profilesModel.checkEmail(email);
        if (!check_email.status) return response.json({ status: false, message: check_email.message });
        if (check_email.isExist) return response.json({ status: false, message: "Email already exist! Please try with different email." });
        if (password.length < 6) return response.json({ status: false, message: "You have to enter at least 6 digit password!" });

        var insert_profile_data = {
            'username': username,
            'email': email,
            'password': hashPassword(password),
            'status': 1,
            'is_social_login': 0,
            'otp': randomstring.generate({ length: 6, charset: 'numeric' }),
            'created_at': curruntTime,
            'device_token': device_token,
            'longitude': longitude,
            'device_type': device_type,
            'latitude': latitude
        }
        // Insert
        const add_profile = await profilesModel.insertProfilesData(insert_profile_data);
        if (!add_profile.status) return response.json({ status: false, message: add_profile.message });

        var profile_id = add_profile.data.insertId;

        // send verify email or sms
        const getProfileDetial = await profilesModel.getProfileData(profile_id);
        if (!getProfileDetial.status) return response.json({ status: false, data: getProfileDetial.message });

        var result = getProfileDetial.data;
        var token = jwt.sign(JSON.stringify(result), JWTSecretKey.toString('utf-8'), {
            algorithm: "HS256"
        });

        return response.json({ status: true, message: "Sign up successfully.", data: token });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.userLogin = async (request, response) => {
    try {

        const request_body = request.body;

        if (request_body.is_social_login == 0) {
            if (!request_body.password) return response.json({ status: false, message: "Please enter password." });
            request_body.password = hashPassword(request_body.password);

            const getProfileName = await profilesModel.checkUserName(request_body.username);
            if (!getProfileName.isExist) return response.json({ status: false, message: "User is not exist. Please try with your email." });

            const getProfileResult = await profilesModel.loginQueryData(request_body);
            if (getProfileResult.status == false) return response.json({ status: false, message: getProfileResult.message });
            const profileData = getProfileResult.data
            
            var update_data_val = {
                'id':profileData.id,
                'updated_at': curruntTime,
                'device_token': request_body.device_token,
                'longitude': request_body.longitude,
                'device_type': request_body.device_type,
                'latitude': request_body.latitude
            }

            const updateProfile = await profilesModel.updateProfilesData(update_data_val);
            if (!updateProfile.status) return response.json({ status: updateProfile.status, message: updateProfile.message });

            var token = jwt.sign(JSON.stringify(profileData), JWTSecretKey.toString('utf-8'), {
                algorithm: "HS256"
            });
            return response.json({ status: true, message: "Login succsess.", data: token });


        } else {
            const { email, is_social_login, social_media_type, social_media_id, username, device_token, longitude, device_type, latitude } = request_body
            var new_user_name = username
            if (!email || !is_social_login || !social_media_type || !social_media_id || !username || !device_type || !device_token)
                return response.json({ status: false, message: "All fields are required!" });

            const existSocial = await profilesModel.checkAndGetSocialMediaDataExists(social_media_type, social_media_id);
            if (!existSocial.status) return response.json({ status: false, message: existSocial.message });
            if (existSocial.isExist) {
                var result = existSocial.data;
                var token = jwt.sign(JSON.stringify(result), JWTSecretKey.toString('utf-8'), {
                    algorithm: "HS256"
                });

                return response.json({ status: true, message: "User loging successfully.", data: token });
            } else {
                const check_email = await profilesModel.checkEmail(email);
                if (!check_email.status) return response.json({ status: false, message: check_email.message });
                if (check_email.isExist) return response.json({ status: false, message: "Email already exist! Please try with different email." });

                const check_username = await profilesModel.checkUserName(new_user_name);
                if (!check_username.status) return response.json({ status: false, message: check_username.message });
                if (check_username.isExist) new_user_name = email.split('@')[0]


                var insert_profile_data = {
                    'username': new_user_name,
                    'email': email,
                    'password': hashPassword('TravelPocket@2023'),
                    'status': 1,
                    'is_social_login': is_social_login,
                    'social_media_type': social_media_type,
                    'social_media_id': social_media_id,
                    'otp': randomstring.generate({ length: 6, charset: 'numeric' }),
                    'created_at': curruntTime,
                    'device_token': device_token,
                    'longitude': longitude,
                    'device_type': device_type,
                    'latitude': latitude
                }
                // Insert
                const add_profile = await profilesModel.insertProfilesData(insert_profile_data);
                if (!add_profile.status) return response.json({ status: false, message: add_profile.message });
                var profile_id = add_profile.data.insertId;

                const getProfileDetial = await profilesModel.getProfileData(profile_id);
                if (!getProfileDetial.status) return response.json({ status: false, data: getProfileDetial.message });

                var result = getProfileDetial.data;
                var token = jwt.sign(JSON.stringify(result), JWTSecretKey.toString('utf-8'), {
                    algorithm: "HS256"
                });

                return response.json({ status: true, message: "User loging successfully.", data: token });
            }
        }

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.forgotPassword = async (request, response) => {
    try {
        const request_body = request.body;

        const getProfileByEmail = await profilesModel.getProfileByEmail(request_body.email);
        if (!getProfileByEmail.status) return response.json({ status: getProfileByEmail.status, message: getProfileByEmail.message });

        var profile_id = getProfileByEmail.data.id;
        const update_data_val = { id: profile_id, otp: randomstring.generate({ length: 6, charset: 'numeric' }) };

        var subject = "Otp for Forgot Password"
        var html = "<h3>Hello, your OTP for Password Reset is </h3>" + "<h1 style='font-weight:bold;'>" + update_data_val.otp + "</h1>"
        const sendOTP = await sendOTPEmail(request_body.email, subject, html)
        if (!sendOTP.status) return response.json({ status: false, message: sendOTP.message });

        const updateProfile = await profilesModel.updateProfilesData(update_data_val);
        if (!updateProfile.status) {
            return response.json({ status: updateProfile.status, message: updateProfile.message });
        }

        return response.json({ status: true, message: "OTP Code has been sent to your email please check your email." });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.verifyOtp = async (request, response) => {
    try {
        const { email, otp } = request.body;

        const getProfileByEmail = await profilesModel.getProfileByEmail(email);
        if (!getProfileByEmail.status) return response.json({ status: getProfileByEmail.status, message: getProfileByEmail.message });

        if (getProfileByEmail.data.otp != otp) return response.json({ status: false, message: "Incorrect OTP. Please, try again." });
        return response.json({ status: true, message: "Valid OTP." });
    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.resetPassword = async (request, response) => {
    try {
        const { email, password } = request.body;

        const getProfileByEmail = await profilesModel.getProfileByEmail(email);
        if (!getProfileByEmail.status) return response.json({ status: false, message: getProfileByEmail.message });
        var profile_id = getProfileByEmail.data.id;

        if (password.length < 6) return response.json({ status: false, message: "You have to enter at least 6 digit!" });

        let update_data_val = { id: profile_id, password: hashPassword(password), otp: '' };
        const updateProfile = await profilesModel.updateProfilesData(update_data_val);
        if (!updateProfile.status) return response.json({ status: false, message: updateProfile.message });

        return response.json({ status: true, message: "The Password Successfully Updated." });
    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}


// module.exports.verifyEmail = async (request, response) => {
//     try {
//         const body = request.query;

//         if (!body.verify) return response.status(200).sendFile(global.ROOT_HTML_TEMPLATE_PATH + "html-template/verify_failed.html");

//         const decordData = await decode(body.verify)
//         if (!decordData.id || !decordData.verification_code) return response.status(200).sendFile(global.ROOT_HTML_TEMPLATE_PATH + "html-template/verify_failed.html");

//         const checkData = { 'verification_code': decordData.verification_code ? decordData.verification_code.toString() : "", 'id': decordData.id ? parseInt(decordData.id) : 0 }
//         const checkValidCode = await profilesModel.checkVerifyCodeIsValid(checkData);
//         if (!checkValidCode.status || !checkValidCode.isExist) return response.status(200).sendFile(global.ROOT_HTML_TEMPLATE_PATH + "html-template/verify_failed.html");

//         const updateData = { id: decordData.id, verification_code: null, is_email_verify: 1 };
//         const updateProfile = await profilesModel.updateProfilesData(updateData);
//         if (!updateProfile.status) return response.status(200).sendFile(global.ROOT_HTML_TEMPLATE_PATH + "html-template/verify_failed.html");
//         return response.status(200).sendFile(global.ROOT_HTML_TEMPLATE_PATH + "html-template/verify_success.html");

//     } catch (e) {
//         return response.status(200).sendFile(global.ROOT_HTML_TEMPLATE_PATH + "html-template/verify_failed.html");
//     }
// }

module.exports.deleteUser = async (request, response) => {
    try {
        const { id } = request.body;
        const { user_id } = request.params;

        const getExistRecord = await profilesModel.getProfileData(user_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        const getUserDetail = getExistRecord.data
        if (getUserDetail.user_id != id) return response.json({ status: false, message: 'You are not ablet to delete this plan.' });

        getUserDetail.status = '0'

        const editData = await profilesModel.updateUserPlanUSData(getUserDetail);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Plan deleted successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}
