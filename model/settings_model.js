const database = require("../config/db");

module.exports.insertContactUSData = async (posted_data) => {
    return new Promise(async resolve => {
        database.query(`INSERT INTO contact_us SET ?`, posted_data, function (err, result) {
            if (err) return resolve({ status: false, message: 'Error while send contact us data.' + err });
            if (result && result.insertId) return resolve({ status: true, data: result, message: 'success' });
            return resolve({ status: false, message: 'Something went wrong. while insert contact us data.', data: [] });
        });
    });
}
