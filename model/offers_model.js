const isset = require("isset");
const database = require("../config/db");

module.exports.insertOfferData = async (posted_data) => {
    return new Promise(async resolve => {
        database.query(`INSERT INTO offers SET ?`, posted_data, function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while add offers data.' + err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while insert offer data.', data: [] });
        });
    });
}

module.exports.updateOfferData = async (posted_data) => {
    return new Promise(async resolve => {
        var updateQry = `UPDATE offers SET ? WHERE id = ?`;
        database.query(updateQry, [posted_data, posted_data.id], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while update offers data.' + err });
            if (result && result.affectedRows) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while update plan data' });
        });
    });
}

module.exports.getOfferById = async (offer_id) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM offers WHERE id = ?  AND status = '1';`;
        var sqlQuery = database.query(get, [offer_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get offers detail." + err });
            if (result && result.length == 1) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "Record not found.Please try again." });
        })
    });
}

module.exports.getAllOffers = async (place_id) => {
    return new Promise(async resolve => {
        let get = `SELECT 
                    OFFER.id,
                    OFFER.place_id,
                    offer_start,
                    offer_end,
                    offer_in,
                    offer,
                    TP.place_name,
                    TP.best_price,
                    TP.price,
                    TP.state_name,
                    TP.country_name,
                    TP.sort_description,
                    TP.long_description,
                    TP.is_suggested,
                    4 as review
                FROM
                    offers OFFER
                        INNER JOIN
                    tourist_places TP ON TP.id = OFFER.place_id
                WHERE
                    OFFER.status = '1' AND TP.status = '1'`;
        if (isset(place_id) && place_id != '') get += ` AND OFFER.place_id = ${place_id} `

        var sqlQuery = database.query(get, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get offers detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: "Record not found.Please try again." });
        })
    });
}



