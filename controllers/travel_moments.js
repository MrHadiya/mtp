const config = require("../config/config");
var randomstring = require("randomstring");
var travelMomentsModel = require('../model/travel_moments_model');
var offersModel = require('../model/offers_model');
const moment = require('moment');
const curruntTime = moment(new Date()).format('YYYY-MM-DD hh:mm:00')
const { uploadMaterialToAWS, deleteMaterialFromAWS } = require('../helper/common_functions');
const isset = require("isset");


module.exports.addUserGalleries = async (request, response) => {
    try {
        const { id, title, description, longitude, latitude } = request.body;

        var imageName = "";
        if (isset(request.files) && (request.files.image)) {
            console.log(request.files);
            var imageData = request.files.image;
            const movetoAWS = await uploadMaterialToAWS(imageData, 'travel_moments/');
            if (!movetoAWS.status) return response.json({ status: false, message: movetoAWS.message, data: [] });
            if (movetoAWS.data) imageName = movetoAWS.data
        } else {
            return response.json({ status: false, message: "Please select valid image for gallery.", data: [] });
        }


        var insert_data = {
            'user_id': id,
            'title': title,
            'description': description,
            'image': imageName,
            'status': '1',
            'created_at': curruntTime,
            'longitude': longitude,
            'latitude': latitude,

        }
        // // Insert
        const addData = await travelMomentsModel.insertGalleriesData(insert_data);
        if (!addData.status) return response.json({ status: false, message: addData.message });

        return response.json({ status: true, message: "Image added successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.editUserGalleries = async (request, response) => {
    try {
        const { id, title, description, gallery_id, longitude, latitude } = request.body;

        const getExistRecord = await travelMomentsModel.getUserGalleriesRecordById(gallery_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        const getUserGalleriesDetail = getExistRecord.data
        if (getUserGalleriesDetail.user_id != id) return response.json({ status: false, message: 'You are not ablet to delete this gallery.' });

        getUserGalleriesDetail.title = title
        getUserGalleriesDetail.description = description
        getUserGalleriesDetail.longitude = longitude
        getUserGalleriesDetail.latitude = latitude


        if (isset(request.files) && (request.files.image)) {
            var imageData = request.files.image;
            const movetoAWS = await uploadMaterialToAWS(imageData, 'travel_moments/');
            if (!movetoAWS.status) return response.json({ status: false, message: movetoAWS.message, data: [] });
            if (movetoAWS.data) getUserGalleriesDetail.image = movetoAWS.data
        }

        const editData = await travelMomentsModel.updateGalleriesData(getUserGalleriesDetail);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Gallery updated successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.deleteUserGalleries = async (request, response) => {
    try {
        const { id } = request.body;
        const { gallery_id } = request.params;

        const getExistRecord = await travelMomentsModel.getUserGalleriesRecordById(gallery_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        const getUserGalleriesDetail = getExistRecord.data
        if (getUserGalleriesDetail.user_id != id) return response.json({ status: false, message: 'You are not ablet to delete this gallery.' });

        getUserGalleriesDetail.status = '0'

        const editData = await travelMomentsModel.updateGalleriesData(getUserGalleriesDetail);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        const deleteImage = await deleteMaterialFromAWS(getUserGalleriesDetail.image);
        if (!deleteImage.status) return response.json({ status: false, message: deleteImage.message });

        return response.json({ status: true, message: "gallery deleted successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getUserGalleriesList = async (request, response) => {
    try {
        const { id } = request.body;
        const getRecord = await travelMomentsModel.getUserGalleries(id);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        return response.json({ status: true, message: "galleries list get successfully.", data: getRecord.data });
    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getFavoritesTravelMoments = async (request, response) => {
    try {
        const { id, page_no } = request.body;

        var pageNo = page_no ? page_no : 1;
        var limit = 10;
        var offset = ((pageNo - 1) * limit) > 0 ? (pageNo - 1) * limit : 0;
        var getAllData = { 'limit': limit, 'offset': offset, 'user_id': id }


        const getRecord = await travelMomentsModel.getUserFavoritesTravelMomentsPlaces(getAllData);
        const getCount = await travelMomentsModel.getAllFavoritesTravelMomentsCount(getAllData);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        if (!getCount.status) return response.json({ status: false, message: getCount.message });


        return response.json({ status: true, message: "galleries list get successfully.", count: getCount.data, data: getRecord.data });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}


module.exports.getAllTravelMomentList = async (request, response) => {
    try {
        const { id, page_no, search } = request.body;
        var pageNo = page_no ? page_no : 1;
        var searchData = search ? search : null;
        var limit = 10;
        var offset = ((pageNo - 1) * limit) > 0 ? (pageNo - 1) * limit : 0;
        var getAllData = { 'limit': limit, 'offset': offset, 'search': searchData, 'user_id': id }


        const getRecord = await travelMomentsModel.getAllTravelMoments(getAllData);
        const getCount = await travelMomentsModel.getAllTravelCount(getAllData);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        if (!getCount.status) return response.json({ status: false, message: getCount.message });


        return response.json({ status: true, message: "galleries list get successfully.", count: getCount.data, data: getRecord.data });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getOffersList = async (request, response) => {
    try {

        const getRecord = await offersModel.getAllOffers();
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        return response.json({ status: true, message: "Offer list get successfully.", data: getRecord.data });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}