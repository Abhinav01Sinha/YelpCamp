const User = require('../models/user') ;

module.exports.postRegister = async (req, res , next) => {
    try {
        const {username , email , password} = req.body ;
        const newUser = new User({username , email}) ;
        const registerdUser = await User.register(newUser , password) ;

        req.login(registerdUser , err => {
            if(err) return next(err) ;
            req.flash('success' , 'Welcome to YelpCamp') ;
            res.redirect('/campgrounds') ;
        })
    } catch (e) {
        req.flash('error' , e.message) ;
        res.redirect('/register') ;
    }
}

module.exports.register = (req ,res) =>{
    res.render('users/register') ;
}

module.exports.login = (req ,res) =>{
    res.render('users/login') ;
}

module.exports.postLogin = (req,res) =>{
    req.flash('success' , ' Welcome Back User ^_^') ;
    const redirectURL = res.locals.returnTo || '/campgrounds';    
    delete res.locals.returnTo ;           
    res.redirect(redirectURL) ;
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out Successfully ^_^!');
        res.redirect('/campgrounds');
    });
}