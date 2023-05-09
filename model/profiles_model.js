const database = require("../config/db");

module.exports.checkUserName = async (user_name) => {
    return new Promise(async resolve => {
        let check_ex_email = `SELECT  * FROM users WHERE username = ? AND status = 1;`;
        database.query(check_ex_email, [user_name], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.Please try again." + err, data: err });
            if (result && result.length > 0) return resolve({ status: true, isExist: true });
            return resolve({ status: true, isExist: false });
        })
    });
}

module.exports.checkEmail = async (email) => {
    return new Promise(async resolve => {
        let check_ex_email = `SELECT  * FROM users PRO WHERE PRO.email = ? AND status = 1;`;
        database.query(check_ex_email, [email], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.Please try again." + err, data: err });
            if (result && result.length > 0) return resolve({ status: true, isExist: true });
            return resolve({ status: true, isExist: false });
        })
    });
}

module.exports.insertProfilesData = async (posted_data) => {
    return new Promise(async resolve => {
        database.query(`INSERT INTO users SET ?`, [posted_data], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while insert profiles data.' + err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while insert profiles data.', data: [] });
        });
    });
}

module.exports.updateProfilesData = async (posted_data) => {
    return new Promise(async resolve => {
        var updateQry = `UPDATE users SET ? WHERE id = ?`;
        database.query(updateQry, [posted_data, posted_data.id], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while update profiles data.' + err });
            if (result && result.affectedRows) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while update profiles data' });
        });
    });
}

module.exports.getProfileData = async (profile_id) => {
    return new Promise(async resolve => {
        let users = `SELECT * FROM users WHERE id = ?;`;
        var sqlQuery = database.query(users, [profile_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "Something is wrong.Please try again." });
        })
    });
}

module.exports.getUserListData = async (profile_id) => {
    return new Promise(async resolve => {
        let users = `SELECT id,username,avatar,latitude,longitude FROM users WHERE status = '1' ORDER BY id DESC LIMIT 500;`;
        var sqlQuery = database.query(users, [profile_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: "Something is wrong.Please try again." });
        })
    });
}

module.exports.loginQueryData = async (originalData) => {
    return new Promise(async resolve => {
        let exist_code_sql = `SELECT * FROM users PRO WHERE PRO.password = ? AND (PRO.email = ? OR PRO.username = ?) AND PRO.status = 1;`;
        database.query(exist_code_sql, [originalData.password, originalData.username, originalData.username], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while get profiles data.' + err, data: err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: 'Password is incorrect.', data: [] });
        });
    });
}

module.exports.checkAndGetSocialMediaDataExists = async (social_media_type, social_media_id) => {
    return new Promise(async resolve => {
        let checkUser = `SELECT * FROM users PRO WHERE PRO.social_media_type = ? AND PRO.social_media_id = ? LIMIT 1;`;
        database.query(checkUser, [social_media_type, social_media_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.Please try again." + err, data: err });
            if (result && result.length > 0) return resolve({ status: true, isExist: true, data: result[0] });
            return resolve({ status: true, isExist: false, data: [] });
        })
    });
}

module.exports.getProfileByEmail = async (email) => {
    return new Promise(async resolve => {
        let checkRecord = `SELECT * FROM users PRO WHERE PRO.email = ? AND PRO.status = 1;`;
        database.query(checkRecord, [email], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "Your email not found.Please try again." });
        })
    });
}
module.exports.isUsernameExist = async (username, id) => {
    return new Promise(async resolve => {
        let checkRecord = `SELECT * FROM users PRO WHERE PRO.username = ? AND PRO.id != ? AND PRO.status = 1;`;
        var sql = database.query(checkRecord, [username, id], async function (err, result) {
            console.log(sql.sql);
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length > 0) return resolve({ status: false, message: "User name already exist! Please try with different name." });
            return resolve({ status: true, message: 'success' });
        })
    });
}

module.exports.checkPassword = async (old_password, id) => {
    return new Promise(async resolve => {
        let checkPassword = `SELECT * FROM users PRO WHERE PRO.password = ? AND PRO.id = ?;`;
        var sqlQuery = database.query(checkPassword, [old_password, id], async function (err, result) {
            if (result && result.length > 0) return resolve({ status: true, data: [], message: 'Record founded.' });
            return resolve({ status: false, data: [], message: 'Your current password did not matched. Please, try again.' });
        })
    });
}









































module.exports.checkVerifyCodeIsValid = async (checkData) => {
    return new Promise(async resolve => {
        let check_ex_email = `SELECT  PRO.id,PRO.user_name,PRO.email,PRO.contact_no,PRO.status FROM users PRO WHERE PRO.id = ? AND PRO.verification_code = ?;`;
        database.query(check_ex_email, [checkData.id, checkData.verification_code], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.Please try again." + err, data: err });
            if (result && result.length > 0) return resolve({ status: true, isExist: true });
            return resolve({ status: true, isExist: false });
        })
    });
}














module.exports.getUserListByRanking = async () => {
    return new Promise(async resolve => {
        let check_ex_record = `SELECT PRO.id,
                                    PRO.user_name,
                                    PRO.full_name,
                                    PRO.email,
                                    PRO.birth_year,
                                    PRO.avatar_id,
                                    CASE WHEN PRO.avatar_id = '' THEN '' ELSE 
                                        (SELECT AV.avatar FROM avatars AV WHERE AV.id = PRO.avatar_id ) 
                                    END AS avatar,
                                    PRO.country_id,
                                    IFNULL(CON.name,null) AS country_name,
                                    IFNULL(CON.country_code,null) AS country_code,
                                    IFNULL(CON.flag,null) AS country_flag,
                                    XP.xp,
                                    IFNULL((SELECT LP.lp FROM learning_points LP WHERE LP.user_id = PRO.id AND LP.status = 1),0) AS lp,
                                    IFNULL((SELECT LT.learning_token FROM token_learnings LT WHERE LT.user_id = PRO.id AND LT.status = 1),0) AS lt
                            FROM users PRO
                                INNER JOIN experience_points XP ON XP.user_id = PRO.id
                                LEFT JOIN countries CON ON CON.id = PRO.country_id
                            WHERE PRO.status = 1
                            AND XP.status = 1
                            AND XP.xp != 0
                            ORDER BY XP.xp DESC LIMIT 100;`;
        var sqlQuery = database.query(check_ex_record, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile rank detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: "Something is wrong.Please try again." });
        })
    });
}