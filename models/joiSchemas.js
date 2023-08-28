const Joi = require('joi') ;

module.exports.CampgroundSchema = Joi.object({
    Campground : Joi.object({
        title : Joi.string().required() ,
        price : Joi.number().required().min(0),
        image : Joi.string().required() ,
        description : Joi.string().required() ,
        location : Joi.string().required()
    }).required() 
})

module.exports.ReviewSchema = Joi.object({
    Review : Joi.object({
        body : Joi.string().required() ,
        rating : Joi.number().required().min(1).max(5) 
    }).required()
})