const config = require("../config/config");
var randomstring = require("randomstring");
var plansModel = require('../model/plans_model');
const moment = require('moment');
const curruntTime = moment(new Date()).format('YYYY-MM-DD hh:mm:00')



module.exports.addUserPlan = async (request, response) => {
    try {
        const { id, plan_start_date, plan_start_time, about_plan } = request.body;

        var insert_data = {
            'user_id': id,
            'plan_start_date': plan_start_date,
            'plan_start_time': plan_start_time,
            'about_plan': about_plan,
            'status': '1',
            'created_at': curruntTime
        }
        // Insert
        const addData = await plansModel.insertUserPlanUSData(insert_data);
        if (!addData.status) return response.json({ status: false, message: addData.message });

        return response.json({ status: true, message: "Plan added successfully.", data: addData });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.editUserPlan = async (request, response) => {
    try {
        const { id, plan_id, plan_start_date, plan_start_time, about_plan } = request.body;

        const getExistRecord = await plansModel.getUserPlanRecordById(plan_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        const getPlanDetail = getExistRecord.data
        if (getPlanDetail.user_id != id) return response.json({ status: false, message: 'You are not ablet to delete this plan.' });

        getPlanDetail.plan_start_date = plan_start_date
        getPlanDetail.plan_start_time = plan_start_time
        getPlanDetail.about_plan = about_plan

        const editData = await plansModel.updateUserPlanUSData(getPlanDetail);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Plan updated successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.deleteUserPlan = async (request, response) => {
    try {
        const { id } = request.body;
        const { plan_id } = request.params;

        const getExistRecord = await plansModel.getUserPlanRecordById(plan_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        const getPlanDetail = getExistRecord.data
        if (getPlanDetail.user_id != id) return response.json({ status: false, message: 'You are not ablet to delete this plan.' });

        getPlanDetail.status = '0'

        const editData = await plansModel.updateUserPlanUSData(getPlanDetail);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Plan deleted successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getUserPlanList = async (request, response) => {
    try {
        const { id,dates } = request.body;
        
        const getRecord = await plansModel.getUserAllPlans(id,dates);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });

        return response.json({ status: true, message: "plasn list get successfully.", data: getRecord.data });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}