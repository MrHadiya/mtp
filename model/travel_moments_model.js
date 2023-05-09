const database = require("../config/db");

module.exports.insertGalleriesData = async (posted_data) => {
    return new Promise(async resolve => {
        database.query(`INSERT INTO travel_moments SET ?`, posted_data, function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while add travel moments data.' + err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while insert travel moments data.', data: [] });
        });
    });
}


module.exports.updateGalleriesData = async (posted_data) => {
    return new Promise(async resolve => {
        var updateQry = `UPDATE travel_moments SET ? WHERE id = ?`;
        database.query(updateQry, [posted_data, posted_data.id], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while update travel moments data.' + err });
            if (result && result.affectedRows) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while update travel moments data' });
        });
    });
}

module.exports.getUserGalleriesRecordById = async (gallery_id) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM travel_moments WHERE id = ?  AND status = '1';`;
        var sqlQuery = database.query(get, [gallery_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get travel moments detail." + err });
            if (result && result.length == 1) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "Record not found.Please try again." });
        })
    });
}


module.exports.getUserGalleries = async (id) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM travel_moments WHERE user_id = ? AND status = '1';`;
        var sqlQuery = database.query(get, [id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get travel moments detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: "Record not found.Please try again." });
        })
    });
}

module.exports.getAllTravelMoments = async (getAllData) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT 
                            TM.id,
                            US.username,
                            US.avatar AS user_image,
                            TM.user_id,
                            TM.title,
                            TM.description,
                            TM.image,
                            TM.status,
                            TM.created_at,
                            TM.latitude,
                            TM.longitude,
                            IFNULL((SELECT 
                                            IFNULL(FP.status, 0)
                                        FROM
                                            travel_pocket.favorite_places FP
                                        WHERE
                                            FP.user_id = ${getAllData.user_id} AND FP.place_id = TM.id
                                        LIMIT 1),
                                    0) AS is_favorite
                        FROM
                            travel_moments TM
                                INNER JOIN
                            users US ON US.id = TM.user_id
                        WHERE
                            TM.status = '1'`

        if (getAllData && getAllData.search != null) getRecord += ` AND TM.title LIKE "%${getAllData.search}%" `
        getRecord += ` ORDER BY TM.id DESC `
        if (getAllData && getAllData.limit != null && getAllData.offset != null) getRecord += ` LIMIT ${getAllData.limit} OFFSET ${getAllData.offset};`
        var sqlQuery = database.query(getRecord, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get tourist places detail." + err });
            return resolve({ status: true, data: result, message: 'success' });
        })
    });
}

module.exports.getUserFavoritesTravelMomentsPlaces = async (getAllData) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT 
                            TM.id,
                            US.username,
                            US.avatar AS user_image,
                            TM.user_id,
                            TM.title,
                            TM.description,
                            TM.image,
                            TM.status,
                            TM.created_at,
                            TM.latitude,
                            TM.longitude,
                            FP.status AS is_favorite
                        FROM
                            favorite_places FP
                                INNER JOIN
                            travel_moments TM ON TM.id = FP.place_id
                                INNER JOIN
                            users US ON US.id = TM.user_id
                        WHERE
                            TM.status = '1' AND FP.status = '1' AND FP.user_id = ${getAllData.user_id}`
        getRecord += ` ORDER BY FP.id DESC `
        if (getAllData && getAllData.limit != null && getAllData.offset != null) getRecord += ` LIMIT ${getAllData.limit} OFFSET ${getAllData.offset};`
        var sqlQuery = database.query(getRecord, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get tourist places detail." + err });
            return resolve({ status: true, data: result, message: 'success' });
        })
    });
}

module.exports.getAllFavoritesTravelMomentsCount = async (getAllData) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT COUNT(DISTINCT (id)) AS total_record FROM favorite_places WHERE status = '1' AND user_id = ${getAllData.user_id} `;
        database.query(getRecord, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.while get favorite places." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0].total_record });
            return resolve({ status: true, data: 0 });
        })
    });
}
module.exports.getAllTravelCount = async (getAllData) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT COUNT(DISTINCT (id)) AS total_record FROM travel_moments WHERE status = '1' `;
        if (getAllData && getAllData.search != null) getRecord += ` AND title LIKE "%${getAllData.search}%" `
        database.query(getRecord, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.while get question detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0].total_record });
            return resolve({ status: true, data: 0 });
        })
    });
}