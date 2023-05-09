
const config = require("../config/config");
const JWTSecretKey = config.jwtsecretkey;
const jwtExpirySeconds = 60 * 60 * 24;
var jwt = require('jsonwebtoken');

const crypto = require('crypto');
var randomstring = require("randomstring");
const moment = require('moment');
const curruntTime = moment(new Date()).format('YYYY-MM-DD hh:mm:00')
// All Controller
const ordersModel = require('../model/oders_model');
const touristPlacesModel = require('../model/tourist_places_model');


module.exports.addUserOrder = async (request, response) => {
    try {
        const { id, title, start_date, end_date, from_id, to_id, fname, lname, contact_no, dob, nationality, tour_place_id, } = request.body;

        var insert_order_data = {
            'user_id': id,
            'title': title,
            'start_date': start_date,
            'end_date': end_date,
            'from_id': from_id,
            'to_id': to_id,
            'fname': fname,
            'lname': lname,
            'contact_no': contact_no,
            'dob': dob,
            'nationality': nationality,
            'tour_place_id': tour_place_id,
            'status': '1',
            'created_at': curruntTime
        }
        // Insert
        const add_order = await ordersModel.insertordersData(insert_order_data);
        if (!add_order.status) return response.json({ status: false, message: add_order.message });

        return response.json({ status: true, message: "Order added successfully." });
    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getUserOrder = async (request, response) => {
    try {
        console.log(request.body);
        const { id } = request.params;
        const user_id = request.body.id
        const getRecord = await ordersModel.getUserorderRecordById(id, user_id);
        console.log(getRecord);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });

        return response.json({ status: true, message: "offer get successfully.", data: getRecord.data });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getUserAllOrder = async (request, response) => {
    try {

        const { id } = request.body;

        const getRecord = await ordersModel.getUserAllOrderRecord(id);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });

        var getRecordData  = getRecord.data
        if (getRecordData.length != 0) {
            for (var i = 0; i < getRecordData.length; i++) {
                var placeID = getRecordData[i].place_id;
                const placeImage = await touristPlacesModel.getAllTouristPlacesByPlaceID(placeID)
                getRecordData[i].place_images = (placeImage.status) ? placeImage.data : []
            }
        }


       
        return response.json({ status: true, message: "plasn list get successfully.", data: getRecordData });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}