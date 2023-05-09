const Joi = require('@hapi/joi');
const isset = require('isset');

var commonFunction = require('./common_functions');

const validate = async (req, res, next) => {
    try {
        var method = req.url;
        console.log(method);

        var requestData = req.body;
        console.log(requestData);
        if (isset(requestData)) {
            // const data = await commonFunction.decode(requestData.data);
            const data = requestData;
            if (method === "/signup") {

                var checkData = {
                    username: Joi.required(),
                    email: Joi.required(),
                    password: Joi.string().required(),
                    latitude: Joi.string().optional(),
                    longitude: Joi.string().optional(),
                    device_type: Joi.number().valid(0, 1).required(), //0= Android 1= iOS
                    device_token: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }

            if (method === "/login") {
                delete data.files;
                var checkData = {
                    username: Joi.string().required(),
                    is_social_login: Joi.number().valid(0, 1).required(),
                    social_media_type: Joi.number().when('is_social_login', { is: 1, then: Joi.number().valid(1, 2, 3).required() }),
                    social_media_id: Joi.string().when('social_media_type', { is: 1, then: Joi.string().required().label("Please provide valid Google ID.") }).concat(Joi.string().when('social_media_type', { is: 2, then: Joi.string().required().label("Please provide valid Facebook ID.") })).concat(Joi.string().when('social_media_type', { is: 3, then: Joi.string().required().label("Please provide valid Apple ID.") })),
                    email: Joi.string().when('is_social_login', { is: 1, then: Joi.string().required() }),
                    password: Joi.string().when('is_social_login', { is: 0, then: Joi.string().required() }),
                    latitude: Joi.string().optional(),
                    longitude: Joi.string().optional(),
                    device_type: Joi.number().valid(0, 1).required(), //0= Android 1= iOS
                    device_token: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }

            if (method === "/forgot-password") {
                delete data.files;
                schema = Joi.object().keys({
                    email: Joi.string().required(),
                });
            }
            if (method === "/verify-otp") {
                delete data.files;
                schema = Joi.object().keys({
                    email: Joi.required(),
                    otp: Joi.required()
                });
            }
            if (method === "/reset-password") {
                delete data.files;
                schema = Joi.object().keys({
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                });
            }

            if (method === "/update-password") {
                var checkData = {
                    old_password: Joi.required(),
                    password: Joi.required(),
                };
                schema = Joi.object().keys(checkData);
            }

            if (method === "/update-profile" || method === "/notification-setting") {
                var checkData = {
                    notification_status: Joi.number().valid(0, 1).optional(),
                    username: Joi.string().optional(),
                    bio: Joi.string().optional(),
                };
                schema = Joi.object().keys(checkData);
            }

            if (method === "/contact-us") {
                var checkData = {
                    name: Joi.string().required(),
                    email: Joi.string().required(),
                    message: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }

            if (method === "/plans/add") {
                var checkData = {
                    plan_start_date: Joi.date().required(),
                    plan_start_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
                    about_plan: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/oders/add") {
                var checkData = {
                    tour_start_date: Joi.date().required(),
                    tour_end_date: Joi.date().required(),
                    from_id: Joi.number().required(),
                    to_id: Joi.number().required(),
                    fname: Joi.string().required(),
                    lname : Joi.string().required(),
                    contact_no: Joi.string().regex(/^[0-9]{10}$/).required(),
                    dob: Joi.date().required(),
                    nationality: Joi.string().required(),
                    tour_place_id: Joi.number().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/plans/edit") {
                var checkData = {
                    plan_id: Joi.number().required(),
                    plan_start_date: Joi.date().required(),
                    plan_start_time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
                    about_plan: Joi.string().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/travel-moments/add") {
                var checkData = {
                    title: Joi.string().required(),
                    description: Joi.string().optional(),
                    latitude: Joi.string().required(),
                    longitude: Joi.string().required(),

                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/travel-moments/edit") {
                var checkData = {
                    gallery_id: Joi.number().required(),
                    title: Joi.string().required(),
                    description: Joi.string().optional(),
                    latitude: Joi.string().required(),
                    longitude: Joi.string().required(),

                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/travel-moments/get-all") {
                delete data.files;
                var checkData = {
                    page_no: Joi.number().required(),
                    search: Joi.string().optional().allow(''),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/travel-moments/get-favorites") {
                delete data.files;
                var checkData = {
                    page_no: Joi.number().required(),
                };
                schema = Joi.object().keys(checkData);
            }

            if (method === "/plans/list") {
                delete data.files;
                var checkData = {
                    dates: Joi.string().optional().allow(''),
                };
                schema = Joi.object().keys(checkData);
            }

            if (method === "/tourist-places/list") {
                delete data.files;
                var checkData = {
                    page_no: Joi.number().required(),
                    search: Joi.string().optional().allow(''),
                    is_suggested: Joi.number().required(),
                };
                schema = Joi.object().keys(checkData);
            }
            if (method === "/orders/add") {
                delete data.files;
                var checkData = {
                    title: Joi.string().required(),
                    start_date: Joi.date().optional().allow(''),
                    end_date: Joi.date().required(),
                    from_id: Joi.number().required(),
                    to_id: Joi.number().required(),
                    fname: Joi.string().required(),
                    lname: Joi.string().required(),
                    contact_no: Joi.number().required(),
                    dob: Joi.date().required(),
                    nationality: Joi.string().required(),
                    tour_place_id: Joi.number().required(),
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