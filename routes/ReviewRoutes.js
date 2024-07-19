const reviewController=require('../controllers/reviewController');
const auth=require('../controllers/authController');
const express=require('express');

const router=express.Router({mergeParams:true});

router.use(auth.checkToken);

router
.route('/')
.post( auth.restrict('user'),
    reviewController.createIds,
   // reviewController.checkDuplicate,
    reviewController.createReview)

.get(reviewController.getReviews);
module.exports=router;

router.route('/:id')
.delete(auth.restrict('user','admin'),reviewController.deleteReview)
.patch(auth.restrict('user','admin'),reviewController.updateReview)
.get(reviewController.getReview);
