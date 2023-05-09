const moment = require('moment');
const offersModel = require('../../model/offers_model');
const touristPlacesModel = require('../../model/tourist_places_model');
const { sendOTPEmail } = require('../../helper/common_functions');
const curruntTime = moment(new Date()).format('YYYY-MM-DD hh:mm:00')


module.exports.addOffers = async (request, response) => {
    try {
        const { place_id, offer_start, offer_end, offer_in, offer } = request.body;

        var insert_data = {
            'place_id': place_id,
            'offer_start': offer_start,
            'offer_end': offer_end,
            'offer_in': offer_in,
            'offer': offer,
            'status': '1',
            'created_at': curruntTime
        }
        // Insert
        const addData = await offersModel.insertOfferData(insert_data);
        if (!addData.status) return response.json({ status: false, message: addData.message });

        return response.json({ status: true, message: "Offers added successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}


module.exports.editOffers = async (request, response) => {
    try {

        const { offer_id, place_id, offer_start, offer_end, offer_in, offer } = request.body;

        const getExistRecord = await offersModel.getOfferById(offer_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        var offerData = getExistRecord.data
        offerData.place_id = place_id
        offerData.offer_start = offer_start
        offerData.offer_end = offer_end
        offerData.offer_in = offer_in
        offerData.offer = offer

        const editData = await offersModel.updateOfferData(offerData);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Offer updated successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}

module.exports.deleteOffers = async (request, response) => {
    try {
        const { id } = request.body;
        const { offer_id } = request.params;

        const getExistRecord = await offersModel.getOfferById(offer_id);
        if (!getExistRecord.status) return response.json({ status: false, message: getExistRecord.message });

        const getOfferDetail = getExistRecord.data
        getOfferDetail.status = '0'

        const editData = await offersModel.updateOfferData(getOfferDetail);
        if (!editData.status) return response.json({ status: false, message: editData.message });

        return response.json({ status: true, message: "Offer deleted successfully.", data: [] });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}


module.exports.getOffersList = async (request, response) => {
    try {

        const getRecord = await offersModel.getAllOffers();
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        const offerDetail = getRecord.data

        if (offerDetail.length != 0) {
            for (var i = 0; i < offerDetail.length; i++) {
                var placeID = offerDetail[i].place_id;
                const placeImage = await touristPlacesModel.getAllTouristPlacesByPlaceID(placeID)
                offerDetail[i].place_images = (placeImage.status) ? placeImage.data : {}
            }
        }

        return response.json({ status: true, message: "Offer list get successfully.", data: offerDetail });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}
module.exports.getOffersListByPlace = async (request, response) => {
    try {

        const { id } = request.body;
        const { place_id } = request.params;

        const getRecord = await offersModel.getAllOffers(place_id);
        if (!getRecord.status) return response.json({ status: false, message: getRecord.message });
        const offerDetail = getRecord.data

        if (offerDetail.length != 0) {
            for (var i = 0; i < offerDetail.length; i++) {
                var placeID = offerDetail[i].place_id;
                const placeImage = await touristPlacesModel.getAllTouristPlacesByPlaceID(placeID)
                offerDetail[i].place_images = (placeImage.status) ? placeImage.data : {}
            }
        }

        return response.json({ status: true, message: "Offer list get successfully.", data: offerDetail });

    } catch (Err) {
        console.log(Err);
        return response.json({ status: false, message: "Something is wrong.Please try again.", data: [], error: Err });
    }
}
