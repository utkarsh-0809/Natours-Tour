const express=require('express');
const viewController=require('../controllers/viewController');
const auth=require('../controllers/authController');
const bookingController=require('../controllers/bookingController')

//express.Router() is a class provided by Express to help you create separate route files.
const router=express.Router();


// this will be printed first before console.log("hello world")
// because this is imported first
// console.log("hdkgnjfnjfnignkerbe",typeof router)

router.get('/signup',viewController.signup);

router.use(auth.isLoggedInUi) 

// the syntax is router.get('/path', middleware1, middleware2, controllerFunction)
// we can insert as many middlewares as we want
router.get('/',
    bookingController.createBookings,
    viewController.getOverview)
router.get('/tours/:name',viewController.getTour)
  
router.get('/login',viewController.login);
router.get('/account',viewController.account);
router.get('/my-bookings',auth.checkToken,viewController.myBookings);
// router.get('/signup',viewController.signup);

module.exports=router