// const { request, response } = require("express");
const express = require("express");
const router = express.Router();
const { validate } = require('../helper/server_validation');
const { isAuthenticate } = require('../helper/jwt');

//Auth Controller
//User Auth
const authController = require('../controllers/auth');
router.post('/signup', validate, authController.signup);
router.post('/login', validate, authController.userLogin);
router.post('/forgot-password', validate, authController.forgotPassword);
router.post('/verify-otp', validate, authController.verifyOtp);
router.post('/reset-password', validate, authController.resetPassword);
// router.get('/verify-email', authController.verifyEmail);

// //Profile Controller
const profileController = require('../controllers/profiles');
// router.post('/encode_data', profileController.encodeData);
// router.post('/decode_data', profileController.decodeData);
router.put('/update-password', validate, isAuthenticate, profileController.updatePassword);
router.put('/notification-setting', validate, isAuthenticate, profileController.updateProfileData);
router.put('/update-profile', validate, isAuthenticate, profileController.updateProfileData);
router.get('/user/get', isAuthenticate, profileController.getProfileData);
router.get('/user/map-data', isAuthenticate, profileController.getUserListData);

const settingsController = require('../controllers/admin/settings');
router.post('/contact-us', validate, settingsController.contactUs);

const plansController = require('../controllers/plans');
router.post('/plans/add', validate, isAuthenticate, plansController.addUserPlan);
router.put('/plans/edit', validate, isAuthenticate, plansController.editUserPlan);
router.post('/plans/list', validate,isAuthenticate, plansController.getUserPlanList);
router.delete('/plans/delete/:plan_id', isAuthenticate, plansController.deleteUserPlan);

const travelMomentsController = require('../controllers/travel_moments');
router.post('/travel-moments/add', validate, isAuthenticate, travelMomentsController.addUserGalleries);
router.put('/travel-moments/edit', validate, isAuthenticate, travelMomentsController.editUserGalleries);
router.get('/travel-moments/list', isAuthenticate, travelMomentsController.getUserGalleriesList);
router.post('/travel-moments/get-all', validate, isAuthenticate, travelMomentsController.getAllTravelMomentList);
router.delete('/travel-moments/delete/:gallery_id', isAuthenticate, travelMomentsController.deleteUserGalleries);
router.post('/travel-moments/get-favorites',validate,isAuthenticate, travelMomentsController.getFavoritesTravelMoments);

const odersController = require('../controllers/oders');
router.post('/orders/add', validate, isAuthenticate, odersController.addUserOrder);
router.get('/orders/get/:id', isAuthenticate, odersController.getUserOrder);
router.get('/orders/list', isAuthenticate, odersController.getUserAllOrder);


const touristPlacesController = require('../controllers/admin/tourist_places');
const offersController = require('../controllers/admin/offers');
router.post('/tourist-places/list', validate, isAuthenticate, touristPlacesController.getTouristPlacesList);
router.get('/tourist-places/list', isAuthenticate, touristPlacesController.getAllTouristPlacesList);
router.get('/offers/list', isAuthenticate, offersController.getOffersList);
router.get('/tourist-places/like/:id',isAuthenticate, touristPlacesController.likeTouristPlaces);

module.exports = router;