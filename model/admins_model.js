const config = require("../config/config");
const database = require("../config/db");
const crypto = require('crypto');
var randomstring = require("randomstring");

module.exports.getProfileByEmail = async (email) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT id,username,email,status,role FROM admins WHERE email = ?;`;
        var sqlQuery = database.query(getRecord, [email], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "No account with this username or email exists. Please try another username or email." });
        })
    });
}


module.exports.checkEmail = async (email) => {
    return new Promise(async resolve => {
        let check_ex_email = `SELECT * FROM admins WHERE email = ? AND status = '1';`;
        var sqlQuery = database.query(check_ex_email, [email], async function (err, result) {
            console.log(sqlQuery.sql);
            if (err) return resolve({ status: false, message: "Something is wrong.Please try again." + err, data: err });
            if (result && result.length > 0) return resolve({ status: false, message: "Email already exist!" });
            return resolve({ status: true, message: "success" });
        })
    });
}


module.exports.insertProfilesData = async (posted_data) => {
    return new Promise(async resolve => {
        var sqlQuery = database.query(`INSERT INTO admins SET ?`, posted_data, function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while insert profiles data.' + err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while insert profiles data.', data: [] });
        });
    });
}

module.exports.getProfileData = async (profileID) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT id,username,email,status,role FROM admins WHERE id = ?;`;
        var sqlQuery = database.query(getRecord, [profileID], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "Something is wrong.Please try again." });
        })
    });
}


module.exports.loginQueryData = async (email, password) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT id,username,email,status,role FROM admins WHERE password = ? AND email =?;`;
        var sqlQuery = database.query(getRecord, [password, email], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while get profiles data.' + err, data: err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: 'Email or password is incorrect.', data: [] });
        });
    });
}
module.exports.getAllUser = async (getAllData) => {
    return new Promise(async resolve => {
        console.log(getAllData);
        let getRecord = `SELECT username, email, avatar, bio, status FROM users WHERE status = '1' `;
        if (getAllData && getAllData.username != null || getAllData.email != null  ) getRecord += ` AND (username LIKE "%${getAllData.username}%"  OR email LIKE "%${getAllData.email}%")`
        getRecord += ` ORDER BY id DESC `
        if (getAllData && getAllData.limit != null && getAllData.offset != null) getRecord += ` LIMIT ${getAllData.limit} OFFSET ${getAllData.offset};`
        console.log(getRecord);
        var sqlQuery = database.query(getRecord, [getAllData], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get user." + err });
            if (result && result.length != 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: "user not found.Please try again." });
        })
    });
}

module.exports.getAdminCount = async (getAllData) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT COUNT(DISTINCT (id)) AS total_record FROM users WHERE status = '1' `;
        if (getAllData && getAllData.search != null) getRecord += ` AND (username LIKE "%${getAllData.username}%"  OR email LIKE "%${getAllData.email}%") `
        database.query(getRecord, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.while get question detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0].total_record });
            return resolve({ status: true, data: 0 });
        })
    });
}

module.exports.getAllUsersByID = async (places_id) => {
    return new Promise(async resolve => {
        let get = `SELECT username, email, avatar, bio, status FROM admins WHERE id = ?  AND status = '1' ORDER BY id DESC;`;
        var sqlQuery = database.query(get, [places_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get user." + err });
            if (result && result.length != 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: "user not found.Please try again." });
        })
         
    });
}