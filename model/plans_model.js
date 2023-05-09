const database = require("../config/db");

module.exports.insertUserPlanUSData = async (posted_data) => {
    return new Promise(async resolve => {
        database.query(`INSERT INTO user_travel_plans SET ?`, posted_data, function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while add user travel plans data.' + err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while insert plan data.', data: [] });
        });
    });
}

module.exports.getUserPlanRecordById = async (plan_id) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM user_travel_plans WHERE id = ?  AND status = '1';`;
        var sqlQuery = database.query(get, [plan_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length == 1) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "Record not found.Please try again." });
        })
    });
}
module.exports.getUserAllPlans = async (id, dates) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM user_travel_plans WHERE user_id = ? AND status = '1'`;
        if (dates != null && dates != '') get += ` AND plan_start_date IN (${dates})`
        get += ` ORDER BY plan_start_date ASC;`

        var sqlQuery = database.query(get, [id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: "Record not found.Please try again." });
        })
    });
}

module.exports.updateUserPlanUSData = async (posted_data) => {
    return new Promise(async resolve => {
        var updateQry = `UPDATE user_travel_plans SET ? WHERE id = ?`;
        database.query(updateQry, [posted_data, posted_data.id], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while update plan data.' + err });
            if (result && result.affectedRows) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while update plan data' });
        });
    });
}