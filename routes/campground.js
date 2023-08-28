const express = require('express') ;
const router = express.Router() ;
const { CampgroundSchema } = require('../models/joiSchemas') ;
const Campground = require('../models/campground') ;

const AppError = require('../utility/appError')
const catchAsync = require('../utility/catchAsync');

const passport = require('passport');
const LocalStrategy = require('passport-local') ;

//Controllers 
const Camp = require('../Controller/camps')

const {isLoggedIn , validateCamp , isAuthor} = require('../Middleware') ;

//PATHS -->


// INDEX
router.get('/' , catchAsync(Camp.index)) ;

//CREATE
router.get('/new' , isLoggedIn , Camp.createNewCamp) ;

router.post('/' , isLoggedIn , validateCamp , catchAsync( Camp.postNewCamp)) ;

// SHOW DETAILS
router.get('/:id' , catchAsync(Camp.showCamp)) ;

//EDIT 
router.get('/:id/edit' , isLoggedIn , isAuthor , catchAsync( Camp.editCamp )) ;

router.put('/:id' , isLoggedIn , isAuthor , validateCamp , catchAsync( Camp.postEditCamp )) ;

//DELETE 
router.delete('/:id' , isLoggedIn , isAuthor , catchAsync( Camp.deleteCamp)) ;

module.exports = router ;