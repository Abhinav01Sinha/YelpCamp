const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const Review = require('./review') ;

const CampgroundSchema = new Schema({
    title : String , 
    price : Number ,
    image : String ,
    description : String , 
    location : String ,
    author : {
        type : Schema.Types.ObjectId ,
        ref : 'User'
    } ,
    reviews : [
        {
            type : Schema.Types.ObjectId ,
            ref : 'Review'
        }
    ]
}) ;

//Deleting reviews of camp at same time
CampgroundSchema.post('findOneAndDelete' , async function(doc){
    if(doc){
        await Review.deleteMany({ _id :{ $in : doc.reviews}})
    }
})

const Campground = mongoose.model('Campground' , CampgroundSchema) ;
module.exports =  Campground ;