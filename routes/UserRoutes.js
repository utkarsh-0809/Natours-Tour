const express=require('express');
const UserController=require('../controllers/UserController');
const auth=require('../controllers/authController');
const multer=require('multer');


// multer is a middleware for handling multipart/form-data, which is used for uploading files.
// here we are setting the destination for the uploaded files to 'public/img/users'
// multer will save the uploaded files in the specified directory
// and we can access the uploaded files from that directory.
// The dest property specifies the folder where uploaded files will be temporarily stored.
const upload=multer({dest:'public/img/users'})
const router=express.Router();
router
.route('/signup')
.post(auth.signUp);

router
.route('/login')
.post(auth.login)

router.get('/logout',auth.logout)
router
.route('/forgotPassword')
.post(auth.forgotPassword);

router
.patch('/resetPassword/:token',auth.resetPassword)

router.use(auth.checkToken);
// from here we can go further only if we are logged in
 
router.patch('/updateMe',
  UserController.imageUpload,
  UserController.resizePhoto,
  UserController.updateMe);
router.delete('/deleteMe',UserController.deleteMe);

router
.patch('/updatePassword',auth.updatePassword);

router.get('/getMe',UserController.getMe,UserController.getUser)

router
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);


  // from here only admin can go further

  router.use(auth.restrict('admin'));

  router.patch('/updateRoles',UserController.updateRoles);

  
  router
  .route('/')
  .get(UserController.getAllUsers)
  
   

   

  module.exports=router;