const Campground = require('../models/campground') ;

module.exports.index = async (req , res) => {
    const campgrounds = await Campground.find({}) ;
    res.render('campgrounds/index' , {campgrounds}) ;
}

module.exports.createNewCamp = (req , res) =>{
    res.render('campgrounds/new') ;
}

module.exports.postNewCamp = async (req , res) =>{
    const newCamp = new Campground(req.body.Campground) ;
    newCamp.author = req.user._id ;
    await newCamp.save() ;
    req.flash('success' , 'Successfully made a new Campground!!')
    res.redirect(`campgrounds/${newCamp._id}`) ;
}

module.exports.showCamp = async (req , res) =>{
    const {id} = req.params ;
    const found = await Campground.findById(id).populate({
        path: 'reviews',
        populate: { path : 'author' }
    }).populate('author') ;

    if(!found){
        req.flash('error' , 'No Campground Found !!') ;
        res.redirect('/campgrounds') ;
    }
    
    res.render('campgrounds/show' , {found}) ;
}

module.exports.editCamp = async (req , res) =>{ 
    const {id} = req.params ;
    const found = await Campground.findById(id) ;
    if(!found){
        req.flash('error' , 'No Campground Found !!') ;
        res.redirect('/campgrounds') ;
    }
    
    res.render('campgrounds/edit' , {found}) ;
}

module.exports.postEditCamp = async (req , res) =>{
    const {id} = req.params ;   

    const updatedCamp = await Campground.findByIdAndUpdate( id , {...req.body.Campground} ) ;
    console.log(updatedCamp) ;
    req.flash('success' , 'Successfully Updated Campground!!')
    res.redirect(`/campgrounds/${updatedCamp._id}`) ;
}

module.exports.deleteCamp = async (req , res) =>{
    const {id} = req.params ;

    const delCamp = await Campground.findByIdAndDelete(id) ;
    console.log(delCamp) ;
    req.flash('success' , 'Successfully Deleted Campground!!')
    res.redirect('/campgrounds') ;
}
