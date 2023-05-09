const database = require("../config/db");

module.exports.insertTouristPlacesData = async (posted_data) => {
    return new Promise(async resolve => {
        database.query(`INSERT INTO tourist_places SET ?`, posted_data, function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while add tourist places data.' + err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while insert tourist places data.', data: [] });
        });
    });
}

module.exports.updateTouristPlacesData = async (posted_data) => {
    return new Promise(async resolve => {
        var updateQry = `UPDATE tourist_places SET ? WHERE id = ?`;
        database.query(updateQry, [posted_data, posted_data.id], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while update tourist places data.' + err });
            if (result && result.affectedRows) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while update tourist places data' });
        });
    });
}

module.exports.getTouristPlacesRecordById = async (places_id) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM tourist_places WHERE id = ?  AND status = '1';`;
        var sqlQuery = database.query(get, [places_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get tourist places detail." + err });
            if (result && result.length == 1) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "Tourist Places not found.Please try again." });
        })
    });
}


module.exports.getTouristPlacesList = async (getAllData) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT * FROM tourist_places WHERE status = '1' `;
        if (getAllData.isSuggest && getAllData.isSuggest != null) getRecord += ` AND is_suggested = ${getAllData.isSuggest} `;
        if (getAllData && getAllData.search != null) getRecord += ` AND place_name LIKE "%${getAllData.search}%" `
        getRecord += ` ORDER BY id DESC `
        if (getAllData && getAllData.limit != null && getAllData.offset != null) getRecord += ` LIMIT ${getAllData.limit} OFFSET ${getAllData.offset};`
        console.log(getRecord);
        var sqlQuery = database.query(getRecord, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get tourist places detail." + err });
            return resolve({ status: true, data: result, message: 'success' });
        })
    });
}

module.exports.getTouristPlacesCount = async (getAllData) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT COUNT(DISTINCT (id)) AS total_record FROM tourist_places WHERE status = '1' `;
        if (getAllData.isSuggest && getAllData.isSuggest != null) getRecord += ` AND is_suggested = ${getAllData.isSuggest} `;
        if (getAllData && getAllData.search != null) getRecord += ` AND place_name LIKE "%${getAllData.search}%" `
        database.query(getRecord, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.while get question detail." + err });
            if (result && result.length > 0) return resolve({ status: true, data: result[0].total_record });
            return resolve({ status: true, data: 0 });
        })
    });
}

module.exports.insertTouristPlacesImageData = async (posted_data) => {
    return new Promise(async resolve => {
        database.query(`INSERT INTO tourist_place_image SET ?`, posted_data, function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while add tourist places image data.' + err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while insert tourist places image data.', data: [] });
        });
    });
}

module.exports.updateTouristPlacesImageData = async (posted_data) => {
    return new Promise(async resolve => {
        var updateQry = `UPDATE tourist_place_image SET ? WHERE id = ?`;
        database.query(updateQry, [posted_data, posted_data.id], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while update tourist places image data.' + err });
            if (result && result.affectedRows) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while update tourist places image data' });
        });
    });
}

module.exports.getTouristPlacesImageById = async (imageId) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM tourist_place_image WHERE id = ?  AND status = '1';`;
        var sqlQuery = database.query(get, [imageId], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get tourist places image." + err });
            if (result && result.length == 1) return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, message: "Tourist Places image not found.Please try again." });
        })
    });
}

module.exports.getAllTouristPlacesByPlaceID = async (places_id) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM tourist_place_image WHERE tourist_place_id = ?  AND status = '1' ORDER BY id DESC;`;
        var sqlQuery = database.query(get, [places_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get tourist places image." + err });
            if (result && result.length != 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: "Tourist Places image not found.Please try again." });
        })
    });
}

module.exports.getAllTouristPlacesList = async () => {
    return new Promise(async resolve => {
        let get = `SELECT id,place_name FROM tourist_places WHERE status = '1' ORDER BY place_name ASC;`;
        var sqlQuery = database.query(get, async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get tourist places." + err });
            if (result && result.length != 0) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: "Tourist Places not found.Please try again." });
        })
    });
}

module.exports.updateTouristPlacesImagePrimery = async (posted_data) => {
    return new Promise(async resolve => {
        var updateQry = `UPDATE tourist_place_image SET is_primery = '0' WHERE is_primery = '1' AND tourist_place_id = ?`;
        database.query(updateQry,[posted_data.tourist_place_id], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while update tourist places image data.' + err });
            if (result && result.affectedRows) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while update tourist places image data' });
        });
    });
}

module.exports.editTouristPlacesImagePrimery = async (posted_data) => {
    return new Promise(async resolve => {
        var updateQry = `UPDATE tourist_place_image SET is_primery = '1' WHERE id = ?`;
        database.query(updateQry, [posted_data.id], function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while update tourist places image data.' + err });
            if (result && result.affectedRows) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while update tourist places image data' });
        });
    });
}


module.exports.insertUserLikedPlace = async (posted_data) => {
    return new Promise(async resolve => {
        database.query(`INSERT INTO favorite_places SET ?`, posted_data, function (err, result) {
            if (err) return resolve({ status: false, message: err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while like places data.', data: [] });
        });
    });
}

module.exports.updateUserLikedPlace = async (posted_data) => {
    return new Promise(async resolve => {
        var updateQry = `UPDATE favorite_places SET ? WHERE id = ?`;
        database.query(updateQry, [posted_data, posted_data.id], function (err, result) {
            if (err) return resolve({ status: false, message: err });
            if (result && result.affectedRows) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while like places data' });
        });
    });
}

module.exports.getLikedPlacesByUser = async (postData) => {
    return new Promise(async resolve => {
        let get = `SELECT * FROM favorite_places WHERE place_id = ?  AND user_id = ? LIMIT 1;`;
        var sqlQuery = database.query(get, [postData.place_id, postData.user_id], async function (err, result) {
            if (err) return resolve({ status: false, message: err });
            return resolve({ status: true, data: result });
        })
    });
}

module.exports.getTouristPlacesById = async (places_id) => {
    return new Promise(async resolve => {
        let getRecord = `SELECT * FROM tourist_places WHERE id = ? LIMIT 1`;
        var sqlQuery = database.query(getRecord, [places_id], async function (err, result) {
            if (err) return resolve({ status: false, message: "Something is wrong.when get tourist places detail." + err });
            if (result && result.length == 1 )return resolve({ status: true, data: result[0], message: 'success' });
            return resolve({ status: false, data: [], message: 'Something is wrong.when get tourist places detail.' });
        })
    });
}