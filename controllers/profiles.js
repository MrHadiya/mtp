const config = require("../config/config");

const JWTSecretKey = config.jwtsecretkey;
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
var randomstring = require("randomstring");
var profilesModel = require('../model/profiles_model');
const moment = require('moment');
const curruntTime = moment(new Date()).format('YYYY-MM-DD hh:mm:00')
const { encode, uploadMaterialToAWS } = require('../helper/common_functions');
const isset = require("isset");
function hashPassword(password) {
    password = config.passwordSalt + password;
    var hash = crypto.createHash('sha1');
    hash.update(password);
    var value = hash.digest('hex');
    return value;
}


module.exports.updatePassword = async (request, response) => {
    try {
        const { id, old_password, password } = request.body;

        var profile_id = id;
        var oldPassword = hashPassword(old_password);
        console.log(oldPassword);
        const checkPassword = await profilesModel.checkPassword(oldPassword, profile_id);
        // console.log(checkPassword);
        if (!checkPassword.status) return response.json({ status: false, message: checkPassword.message });
        if (password.length < 6) return response.json({ status: false, message: "You have to enter at least 6 digit!" });

        let update_data_val = { id: profile_id, password: hashPassword(password) };

        const updateProfile = await profilesModel.updateProfilesData(update_data_val);
        if (!updateProfile.status) return response.json({ status: false, message: updateProfile.message });

        return response.json({ status: true, message: "The Password Successfully Updated." });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.updateProfileData = async (request, response) => {
    try {
        const request_body = request.body;
        const id = request_body.id
        const getProfile = await profilesModel.getProfileData(id);
        if (!getProfile.status) return response.json({ status: false, message: getProfile.message });

        let update_data_val = { 'id': id };
        if (request_body.notification_status) update_data_val.notification_status = request_body.notification_status
        if (request_body.bio) update_data_val.bio = request_body.bio
        if (request_body.username) {
            const isUsernameExist = await profilesModel.isUsernameExist(request_body.username, id);
            if (!isUsernameExist.status) return response.json({ status: false, message: isUsernameExist.message });
            update_data_val.username = request_body.username
        }

        if (isset(request.files) && (request.files.image)) {
            var imageData = request.files.image;
            const movetoAWS = await uploadMaterialToAWS(imageData, 'user_avatar/');
            if (!movetoAWS.status) return response.json({ status: false, message: movetoAWS.message, data: [] });
            if (movetoAWS.data) update_data_val.avatar = movetoAWS.data
        } 

        // var newFileName = "";
        // if (isset(request.files) && (request.files.file)) {
        //     var topicImage = request.files.file;
        //     const movetoAWS = await uploadMaterialToAWS(topicImage, 'topicImg/');
        //     if (!movetoAWS.status) return response.json({ status: false, message: movetoAWS.message, data: [] });
        //     if (movetoAWS.data) update_data_val.avatar = movetoAWS.data

        // }


        const updateProfile = await profilesModel.updateProfilesData(update_data_val);
        if (!updateProfile.status) return response.json({ status: false, message: updateProfile.message });

        const getProfileData = await profilesModel.getProfileData(id);
        var token = jwt.sign(JSON.stringify(getProfileData.data), JWTSecretKey);

        var message = "The Profile successfully updated."
        if (request_body.notification_status) {
            message = (request_body.notification_status == 0) ? 'Notification turn Off successfully' : 'Notification turn On successfully.'
        }
        return response.json({ status: true, message: message, data: token });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getProfileData = async (request, response) => {
    try {
        const { id } = request.body;

        const getProfileData = await profilesModel.getProfileData(id);
        var token = jwt.sign(JSON.stringify(getProfileData.data), JWTSecretKey);

        return response.json({ status: true, message: "The Profile successfully loadded.", data: getProfileData.data }); 
    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getUserListData = async (request, response) => {
    try {
        const { id } = request.body;

        const getProfileData = await profilesModel.getUserListData(id);
   
        return response.json({ status: true, message: "The Profile successfully loadded.", data: getProfileData.data }); 
    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}



// module.exports.notificationSetting = async (request, response) => {
//     try {
//         const { id, notification_status } = request.body;

//         const getProfile = await profilesModel.getProfileData(id);
//         if (!getProfile.status) return response.json({ status: false, message: getProfile.message });

//         let update_data_val = { 'id': id, 'notification_status': notification_status };
//         const updateProfile = await profilesModel.updateProfilesData(update_data_val);
//         if (!updateProfile.status) return response.json({ status: false, message: updateProfile.message });

//         const getProfileData = await profilesModel.getProfileData(id);
//         var token = jwt.sign(JSON.stringify(getProfileData.data), JWTSecretKey);


//         return response.json({ status: true, message: notificationMsg, data: token });

//     } catch (Err) {
//         console.log(Err);
//         return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
//     }
// }




// module.exports.encodeData = async (request, response) => {
//     try {
//         const ciphertext = await commonFunction.encode(request.body);
//         return response.json(ciphertext);
//     } catch (Err) {
//         console.log(Err);
//         return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
//     }
// }

// module.exports.decodeData = async (request, response) => {
//     try {
//         var encodedData = request.body;
//         const ciphertext = await commonFunction.decode(encodedData.data);
//         return response.json(ciphertext);
//     } catch (Err) {
//         console.log(Err);
//         return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
//     }
// }







