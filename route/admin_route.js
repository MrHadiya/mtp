// const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const { validate } = require('../helper/admin_validation');
const { isAdminAuthenticate } = require('../helper/jwt');

const authController = require('../controllers/admin/auth');
//Admin Auth
router.post('/login', validate, authController.userLogin);
router.post('/signup', validate, authController.signup);
router.post('/get-user',authController.getAdminList)


const touristPlacesController = require('../controllers/admin/tourist_places');
router.post('/tourist-places/add', validate, isAdminAuthenticate, touristPlacesController.addTouristPlaces);
router.put('/tourist-places/edit', validate, isAdminAuthenticate, touristPlacesController.editTouristPlaces);
router.post('/tourist-places/list', validate, isAdminAuthenticate, touristPlacesController.getTouristPlacesList);
router.get('/tourist-places/list', isAdminAuthenticate, touristPlacesController.getAllTouristPlacesList);
router.delete('/tourist-places/delete/:places_id', isAdminAuthenticate, touristPlacesController.deleteTouristPlaces);
router.put('/tourist-places/is-active',  isAdminAuthenticate, touristPlacesController.isActiveTouristPlaces);
router.get('/tourist-places/view/:places_id',  isAdminAuthenticate, touristPlacesController.viewTouristPlaces);


router.post('/places-image/add', validate, isAdminAuthenticate, touristPlacesController.addTouristPlacesImage);
router.delete('/places-image/delete/:image_id', isAdminAuthenticate, touristPlacesController.deleteTouristPlacesImage);
router.put('/places-image/edit', isAdminAuthenticate, touristPlacesController.isPrimeryTouristPlacesImage);


const offersController = require('../controllers/admin/offers');
router.post('/offers/add', validate, isAdminAuthenticate, offersController.addOffers);
router.put('/offers/edit', validate, isAdminAuthenticate, offersController.editOffers);
router.get('/offers/list', isAdminAuthenticate, offersController.getOffersList);
router.get('/offers/by-place/:place_id', isAdminAuthenticate, offersController.getOffersListByPlace);
router.delete('/offers/delete/:offer_id', isAdminAuthenticate, offersController.deleteOffers);
module.exports = router;