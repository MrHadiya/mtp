const config = require("../../config/config");
var randomstring = require("randomstring");
var touristPlacesModel = require('../../model/tourist_places_model');
const moment = require('moment');
const curruntTime = moment(new Date()).format('YYYY-MM-DD hh:mm:00')
const { uploadMaterialToAWS, deleteMaterialFromAWS } = require('../../helper/common_functions');
const isset = require("isset");


module.exports.addTouristPlaces = async (request, response) => {
    try {
        const { place_name, best_price, price, state_name, country_name, sort_description, long_description, is_suggested } = request.body;

        var insert_data = {
            'place_name': place_name,
            'best_price': best_price,
            'best_price': best_price,
            'price': price,
            'state_name': state_name,
            'country_name': country_name,
            'sort_description': sort_description,
            'long_description': long_description,
            'is_suggested': is_suggested,
            'status': '1',
            'created_at': curruntTime
        }
        // // Insert
        const addData = await touristPlacesModel.insertTouristPlacesData(insert_data);
        if (!addData.status) return response.json({ status: false, message: addData.message });

        return response.json({ status: true, message: "Place added successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.editTouristPlaces = async (request, response) => {
    try {
        const { id, place_name, best_price, price, state_name, country_name, sort_description, long_description, is_suggested, places_id } = request.body;

        const getExistRecord = await touristPlacesModel.getTouristPlacesRecordById(places_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        var placeData = getExistRecord.data
        placeData.place_name = place_name
        placeData.best_price = best_price
        placeData.price = price
        placeData.state_name = state_name
        placeData.country_name = country_name
        placeData.sort_description = sort_description
        placeData.long_description = long_description
        placeData.is_suggested = is_suggested

        const editData = await touristPlacesModel.updateTouristPlacesData(placeData);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Place updated successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.deleteTouristPlaces = async (request, response) => {
    try {
        const { id } = request.body;
        const { places_id } = request.params;

        const getExistRecord = await touristPlacesModel.getTouristPlacesRecordById(places_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        const getPlacesDetail = getExistRecord.data
        getPlacesDetail.status = '0'

        const editData = await touristPlacesModel.updateTouristPlacesData(getPlacesDetail);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Places deleted successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getTouristPlacesList = async (request, response) => {
    try {
        const { id, page_no, search, is_suggested } = request.body;

        var pageNo = page_no ? page_no : 1;
        var searchData = search ? search : null;
        var limit = 10;
        var offset = ((pageNo - 1) * limit) > 0 ? (pageNo - 1) * limit : 0;
        var getAllData = { 'limit': limit, 'offset': offset, 'search': searchData, 'isSuggest': is_suggested }

        const getRecord = await touristPlacesModel.getTouristPlacesList(getAllData);
        const getCount = await touristPlacesModel.getTouristPlacesCount(getAllData);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        if (!getCount.status) return response.json({ status: false, message: getCount.message });
        const placeDetail = getRecord.data

        if (placeDetail.length != 0) {
            for (var i = 0; i < placeDetail.length; i++) {
                var placeID = placeDetail[i].id;
                const placeImage = await touristPlacesModel.getAllTouristPlacesByPlaceID(placeID)
                placeDetail[i].place_images = (placeImage.status) ? placeImage.data : {}
            }
        }

        return response.json({ status: true, message: "Place list get successfully.", count: getCount.data, data: placeDetail });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.getAllTouristPlacesList = async (request, response) => {
    try {

        const getRecord = await touristPlacesModel.getAllTouristPlacesList();
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        return response.json({ status: true, message: "Place list get successfully.", data: getRecord.data });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.viewTouristPlaces = async (request, response) => {
    try {
        const { places_id } = request.params;

        const getRecord = await touristPlacesModel.getTouristPlacesById(places_id);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        const placeDetail = getRecord.data

        const placeImage = await touristPlacesModel.getAllTouristPlacesByPlaceID(places_id)
        placeDetail.place_images = (placeImage.status) ? placeImage.data : {}
        return response.json({ status: true, message: "Place list get successfully.", data: placeDetail });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.addTouristPlacesImage = async (request, response) => {
    try {
        const { places_id } = request.body;

        var imageName = "";
        if (isset(request.files) && (request.files.image)) {
            var imageData = request.files.image;
            const movetoAWS = await uploadMaterialToAWS(imageData, 'places_images/');
            if (!movetoAWS.status) return response.json({ status: false, message: movetoAWS.message, data: [] });
            if (movetoAWS.data) imageName = movetoAWS.data
        } else {
            return response.json({ status: false, message: "Please select valid image for Places.", data: [] });
        }

        const getExistRecord = await touristPlacesModel.getTouristPlacesRecordById(places_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        var insert_data = { 'tourist_place_id': places_id, 'image': imageName, 'status': '1', 'created_at': curruntTime }
        // // Insert
        const addData = await touristPlacesModel.insertTouristPlacesImageData(insert_data);
        if (!addData.status) return response.json({ status: false, message: addData.message });

        return response.json({ status: true, message: "Place Image added successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.deleteTouristPlacesImage = async (request, response) => {
    try {
        const { id } = request.body;
        const { image_id } = request.params;

        const getExistRecord = await touristPlacesModel.getTouristPlacesImageById(image_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        const getPlacesDetail = getExistRecord.data
        getPlacesDetail.status = '0'

        const editData = await touristPlacesModel.updateTouristPlacesImageData(getPlacesDetail);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Image deleted successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.isActiveTouristPlaces = async (request, response) => {
    try {
        const { is_suggested, places_id } = request.body;

        const getExistRecord = await touristPlacesModel.getTouristPlacesRecordById(places_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        var placeData = getExistRecord.data

        placeData.is_suggested = is_suggested

        const editData = await touristPlacesModel.updateTouristPlacesData(placeData);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Place updated successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}
module.exports.isPrimeryTouristPlacesImage = async (request, response) => {
    try {
        const { image_id } = request.body;

        const getExistRecord = await touristPlacesModel.getTouristPlacesImageById(image_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        var placeData = getExistRecord.data

        placeData.id = image_id

        const updateData = await touristPlacesModel.updateTouristPlacesImagePrimery(placeData);
        if (!updateData.status) return response.json({ status: false, message: updateData.message });

        const editData = await touristPlacesModel.editTouristPlacesImagePrimery(placeData);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Image updated successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.likeTouristPlaces = async (request, response) => {
    try {
        const place_id = request.params.id;
        const user_id = request.body.id;

        var postData = { 'place_id': place_id, 'user_id': user_id }
        const getData = await touristPlacesModel.getLikedPlacesByUser(postData);
        if (!getData.status) return response.json({ status: false, message: getData.message });
        const getLikeDetail = getData.data
        if (getLikeDetail && getLikeDetail.length == 0) {
            const addData = await touristPlacesModel.insertUserLikedPlace(postData);
            if (!addData.status) return response.json({ status: false, message: addData.message });
            return response.json({ status: true, message: "like successfully.", data: [] });
        }
        postData.id = getLikeDetail[0].id
        postData.status = (getLikeDetail[0].status == '0') ? '1' : '0'
        const editData = await touristPlacesModel.updateUserLikedPlace(postData);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: (postData.status == '0') ? "un-like successfully." : "like successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}
