const config = require("../../config/config");
const JWTSecretKey = config.jwtsecretkey;
var jwt = require('jsonwebtoken');
// const isset = require('isset');

const crypto = require('crypto');
var randomstring = require("randomstring");

// All Controller
var commonFunction = require('../../helper/common_functions');
var profiles_model = require('../../model/admins_model');

function hashPassword(password) {
    password = config.passwordSalt + password;
    var hash = crypto.createHash('sha1');
    hash.update(password);
    var value = hash.digest('hex');
    return value;
}

module.exports.signup = async (request, response) => {
    try {
        const { username, email, password } = request.body;

        var checkEmail = await profiles_model.checkEmail(email);
        if (!checkEmail.status) return response.json({ status: false, message: checkEmail.message });
        if (password.length < 6) return response.json({ status: false, message: "You have to enter at least 6 digit password!" });

        //SingUp Code
        var insertData = { 'username': username, 'email': email, 'password': hashPassword(password), 'status': '1', 'role': 1 }
        var addProfile = await profiles_model.insertProfilesData(insertData);

        if (!addProfile.status) return response.json({ status: false, message: addProfile.message });

        var profileID = addProfile.data.insertId;
        var getProfileDetial = await profiles_model.getProfileData(profileID);

        if (!getProfileDetial.status) return resolve({ status: false, data: getProfileDetial.message });

        var result = getProfileDetial.data;
        var token = jwt.sign(JSON.stringify(result), JWTSecretKey);
        return response.json({ status: true, message: "The Profile successfully added.", data: token });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.userLogin = async (request, response) => {
    try {

        const { email, password } = request.body;

        var getProfileResult = await profiles_model.loginQueryData(email, hashPassword(password));
        if (!getProfileResult.status) return response.json({ status: false, message: getProfileResult.message });

        var result = getProfileResult.data;
        var token = jwt.sign(JSON.stringify(result), JWTSecretKey);
        return response.json({ status: true, message: "Login successfully.", data: token });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}
module.exports.getUser = async (request, response) => {
    try {

        const { email, password } = request.body;

        const getProfileData = await profiles_model.getProfileData(id);
        var token = jwt.sign(JSON.stringify(getProfileData.data), JWTSecretKey);

        return response.json({ status: true, message: "The Profile successfully loadded.", data: getProfileData.data });
    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}


module.exports.getAdminList = async (request, response) => {
    try {
        const {page_no, search} = request.body;
        console.log(request.body);

        var pageNo = page_no ? page_no : 1;
        var searchdata = search ? search : null;
        var limit = 10;
        var offset = ((pageNo - 1) * limit) > 0 ? (pageNo - 1) * limit : 0;
        var getAllData = { 'limit': limit, 'offset': offset, 'username': searchdata, 'email': searchdata,  }

        const getRecord = await profiles_model.getAllUser(getAllData);
        const getCount = await profiles_model.getAdminCount(getAllData);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        if (!getCount.status) return response.json({ status: false, message: getCount.message });
        const userDetails = getRecord.data

        return response.json({ status: true, message: "User list successfully.", count: getCount.data, data: userDetails });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}