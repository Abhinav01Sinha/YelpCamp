const mongoose = require('mongoose');
const Campground = require('../models/campground') ;

const { places , descriptors } = require('./seedHelpers');
const cities = require('./cities')

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')
.then(()=>{
    console.log("Connection Open ^_^") ;
})

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp');
}
//--------------------------------------------------------------------------



const sample = (array) => array[Math.floor(Math.random()*array.length)]

const seedDB = async () => {
    await Campground.deleteMany({}) ;

    for(let i=0 ; i<50 ; i++){
        const random1000 = Math.floor(Math.random()*1000) ;
        const p = Math.floor(Math.random()*20) + 10 ;
        const camp = new Campground({
            title : `${sample(descriptors)} ${sample(places)}` ,
            location : `${cities[random1000].city} , ${cities[random1000].state}` ,
            author : "64902f2dbc45529be0e2d4a0" ,
            image : 'https://source.unsplash.com/random/90×90/?camping' ,
            price : p ,
            description : 
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorum quidem, ipsum optio, quas rerum expedita blanditiis magni maiores sit numquam architecto omnis officiis illum molestias vel at sequi, nisi perspiciatis."
        })
        await camp.save() ;
    }
}

seedDB().then(()=>{
    console.log("Seeding") ;
    mongoose.connection.close() ;
})