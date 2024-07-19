const express=require('express');
const viewController=require('../controllers/viewController');
const auth=require('../controllers/authController');
const bookingController=require('../controllers/bookingController')

const router=express.Router();

router.get('/signup',viewController.signup);

router.use(auth.isLoggedInUi)

router.get('/',
    bookingController.createBookings,
    viewController.getOverview)
router.get('/tours/:name',viewController.getTour)
  
router.get('/login',viewController.login);
router.get('/account',viewController.account);
router.get('/my-bookings',auth.checkToken,viewController.myBookings);
// router.get('/signup',viewController.signup);

module.exports=router