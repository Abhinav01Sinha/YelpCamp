const express = require('express') ;
const router = express.Router({mergeParams:true}) ;
const User = require('../models/user') ;

const AppError = require('../utility/appError') ;
const catchAsync = require('../utility/catchAsync') ;

const passport = require('passport');
const LocalStrategy = require('passport-local') ;

//Controllers
const user = require('../Controller/user')

router.get('/register' , user.register)
router.post('/register' , catchAsync (user.postRegister))

router.get('/login' , user.login)

router.post('/login' , passport.authenticate('local' , {failureFlash:true , failureRedirect:'/login'}) , user.postLogin ) ;

router.get('/logout', user.logout ); 

module.exports = router ;