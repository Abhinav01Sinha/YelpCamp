const express = require('express') ;
const router = express.Router({mergeParams:true}) ;
const { ReviewSchema } = require('../models/joiSchemas') ;
const Review = require('../models/review') ;
const Campground = require('../models/campground') ;

const catchAsync = require('../utility/catchAsync');

const {isLoggedIn , validateReview , isReviewAuthor} = require('../Middleware') ;

//Controller
const review = require('../Controller/review')

//Adding reviews ->
router.post('/' , isLoggedIn , validateReview , catchAsync( review.postReview ))

//Delete Reviews ->
router.delete('/:reviewId' , isLoggedIn , isReviewAuthor , catchAsync( review.deleteReview))

module.exports = router ;