const Review = require('../models/review') ;
const Campground = require('../models/campground') ;

module.exports.postReview = async (req , res) =>{
    const camp = await Campground.findById(req.params.id) ;
    const review = new Review(req.body.Review) ;
    review.author = req.user._id ;
    console.log(review) ;
    camp.reviews.push(review) ;
    await review.save() ;
    await camp.save() ;
    
    req.flash('success' , 'Successfully added the Review!!')
    res.redirect(`/campgrounds/${camp._id}`) ;
}

module.exports.deleteReview = async (req , res) =>{
    const {id , reviewId} = req.params ;
    const camp = await Campground.findByIdAndUpdate(id , {$pull : {reviews: reviewId}}) ;
    const del = await Review.findByIdAndDelete(reviewId) ;
    console.log(del) ;
    req.flash('success' , 'Successfully deleted the Review!!')
    res.redirect(`/campgrounds/${id}`) ;
}