const Joi = require('@hapi/joi');
const isset = require('isset');

var commonFunction = require('./common_functions');

const validate = async (req, res, next) => {
    try {
        var method = req.url;

        var requestData = req.body;
        if (isset(requestData)) {
            const data = await requestData;
            console.log(data);
            if (method === "/signup") {

                var checkData = {
                    username: Joi.required(),
                    email: Joi.required(),
                    password: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }

            if (method === "/login") {
                delete data.files;
                var checkData = {
                    password: Joi.string().required(),
                    email: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/forgot-password") {
                delete data.files;
                var checkData = {
                    email: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/reset-password") {
                delete data.files;
                var checkData = {
                    email: Joi.string().required(),
                    otp: Joi.string().required(),
                    password: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/update-password") {
                delete data.files;
                var checkData = {
                    old_password: Joi.string().required(),
                    password: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/tourist-places/add") {
                delete data.files;
                var checkData = {
                    place_name: Joi.string().required(),
                    best_price: Joi.number().required(),
                    price: Joi.number().required(),
                    state_name: Joi.string().required(),
                    country_name: Joi.string().required(),
                    sort_description: Joi.string().required(),
                    long_description: Joi.string().optional().allow(''),
                    is_suggested: Joi.number().valid(0, 1).required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/tourist-places/edit") {
                delete data.files;
                var checkData = {
                    places_id: Joi.number().required(),
                    place_name: Joi.string().required(),
                    best_price: Joi.number().required(),
                    price: Joi.number().required(),
                    state_name: Joi.string().required(),
                    country_name: Joi.string().required(),
                    sort_description: Joi.string().required(),
                    long_description: Joi.string().optional().allow(''),
                    is_suggested: Joi.number().valid(0, 1).required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/tourist-places/list") {
                delete data.files;
                var checkData = {
                    page_no: Joi.number().required(),
                    search: Joi.string().optional().allow(''),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/places-image/add") {
                delete data.files;
                var checkData = {
                    places_id: Joi.number().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/offers/add") {
                delete data.files;
                var checkData = {
                    place_id: Joi.number().required(),
                    offer_start: Joi.date().required(),
                    offer_end: Joi.date().required(),
                    offer_in: Joi.number().required(),
                    offer: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/offers/edit") {
                delete data.files;
                var checkData = {
                    offer_id: Joi.number().required(),
                    place_id: Joi.number().required(),
                    offer_start: Joi.date().required(),
                    offer_end: Joi.date().required(),
                    offer_in: Joi.number().required(),
                    offer: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }


            req.body = data;

            Joi.validate(data, schema, (err) => {
                if (err) {
                    return res.status(200).json({
                        status: false,
                        message: err.details[0].message,
                        data: []
                    })
                } else {
                    return next();
                }
            });
        } else {
            return res.status(200).json({
                status: false,
                message: "Data must be required",
            })
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            status: false,
            message: "Server velidation is fail.",
            data: []
        })
    }
};

module.exports = {
    validate
};