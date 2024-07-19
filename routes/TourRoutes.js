const express=require('express');
const TourController=require('../controllers/TourControllers');
const auth=require('../controllers/authController');
const reviewRouter=require('./ReviewRoutes');
const router=express.Router();
//router.param('id',TourController.checkId);
router.use('/:tourId/review',reviewRouter)

//router.use(auth.isLoggedInUi);
// .post(auth.checkToken,
  //   auth.restrict('user'),
  //   reviewController.createReview)

  router.route('/tours-within/:distance/centre/:latlng/unit/:unit')
  .get(TourController.getTourWithin)

  router.route('/distance/:latlng/unit/mi')
  .get(TourController.getDistance);

router
  .route('/getStats')
  .get(TourController.getStats);

  router
  .route('/getMonthly/:year')
  .get(auth.checkToken,
    auth.restrict('admin,lead-guide','guide'),
    TourController.getMonthly)

router
  .route('/')
  .get(TourController.getAllTours)
  .post(auth.checkToken,
    auth.restrict('admin','lead-guide'),
    TourController.postTour)

  
  


  router
  .route('/:id') 
  .get(TourController.getTour)
  .patch(
    auth.checkToken,
    auth.restrict('admin','lead-guide'),
    TourController.uploadTourImages,
    TourController.resizeTourImage,
    TourController.updateTour)
  .delete(
    auth.checkToken,
    auth.restrict('admin'),
    TourController.deleteTour)




  module.exports=router;