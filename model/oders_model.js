const config = require("../config/config");
const database = require("../config/db");
const crypto = require('crypto');
var randomstring = require("randomstring");

module.exports.insertordersData = async (posted_data) => {
    return new Promise(async resolve => {
        var sqlQuery = database.query(`INSERT INTO oders SET ?`, posted_data, function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while insert profiles data.' + err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while insert profiles data.', data: [] });
        });
    });
}
module.exports.getUserorderRecordById = async (id, user_id) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM oders WHERE id = ${id} AND user_id = ${user_id} AND status = '1' LIMIT 1;`;
        console.log(get);
        var sqlQuery = database.query(get, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length == 1) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "Record not found.Please try again." });
        })
    });
}
module.exports.getUserAllOrderRecord = async (id) => {
    return new Promise(async resolve => {
        let get = `SELECT 
                        ODR.id,
                        ODR.user_id,
                        ODR.title,
                        ODR.start_date,
                        ODR.end_date,
                        ODR.from_id,
                        ODR.to_id,
                        ODR.fname,
                        ODR.lname,
                        ODR.contact_no,
                        ODR.dob,
                        ODR.nationality,
                        ODR.tour_place_id,
                        ODR.status,
                        ODR.created_at,    
                        TP.id as place_id,
                        TP.place_name,
                        TP.best_price,
                        TP.price,
                        TP.state_name,
                        TP.country_name,
                        TP.sort_description,
                        TP.long_description,
                        4 as review,
                        USR.avatar,
                        FRTP.place_name AS from_place_name,
                        TOTP.place_name AS to_place_name
                    FROM
                        oders ODR
                            LEFT JOIN
                        tourist_places FRTP ON FRTP.id = ODR.from_id
                            LEFT JOIN
                        tourist_places TOTP ON TOTP.id = ODR.to_id
                            INNER JOIN
                        tourist_places TP ON TP.id = ODR.tour_place_id
                            INNER JOIN
                        users USR ON USR.id = ODR.user_id
                    WHERE
                        ODR.user_id = ${id} AND ODR.status = '1'
                    ORDER BY ODR.id DESC
                    `;
        var sqlQuery = database.query(get, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get profile detail." + err });
            if (result && result.length != 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: true, message: "Record not found.Please try again.", data: [] });
        })
    });
}