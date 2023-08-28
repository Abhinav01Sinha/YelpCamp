const { CampgroundSchema , ReviewSchema } = require('./models/joiSchemas') ;
const Campground = require('./models/campground') ;
const Review = require('./models/review') 
const AppError = require('./utility/appError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCamp = (req , res , next) => {
    const {error} = CampgroundSchema.validate(req.body) ;
    if(error){
        const msg = error.details.map(el => el.message).join(',') ;
        throw new AppError(msg , 400) ;
    }else{ next() ; }
}

// IsAuthor Middleware  : preventing other users to change DATA
module.exports.isAuthor = async (req , res , next) => {
    const {id} = req.params ;

    const found = await Campground.findById(id) ;
    if(!found.author.equals(req.user._id)){
        req.flash('error' , 'You are not Allowed to access this !!!') ;
        return res.redirect(`/campgrounds/${id}`)
    }
    
    next() ;
}

module.exports.isReviewAuthor = async (req , res , next) => {
    const {id , reviewId} = req.params ;

    const review = await Review.findById(reviewId) ;
    if(!review.author.equals(req.user._id)){
        req.flash('error' , 'You are not Allowed to access this !!!') ;
        return res.redirect(`/campgrounds/${id}`)
    }
    
    next() ;
}

// JOI MIDDLEWARE :
module.exports.validateReview = (req , res , next) => {
    const {error} = ReviewSchema.validate(req.body) ;
    if(error){
        const msg = error.details.map(el => el.message).join(',') ;
        throw new AppError(msg , 400) ;
    }else{ next() ; }
}
