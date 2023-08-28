if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express') ;
const app = express() ;
const path = require('path') ;
const mongoose = require('mongoose');
const methodOverride = require('method-override') ;
const ejsMate = require('ejs-mate') ;

const User = require('./models/user')

// Session for Flash and MongoStore
const session = require('express-session') ;

//Flash
const flash = require('express-flash') ;

//Passport JS password
const passport = require('passport');
const LocalStrategy = require('passport-local') ;

//router 
const campgroundRoutes = require('./routes/campground') ;
const reviewRoutes = require('./routes/review') ;
const userRoutes = require('./routes/user') ;

//error
const AppError = require('./utility/appError')
const catchAsync = require('./utility/catchAsync');

//Mongo-Sanatize 
const mongoSanitize = require('express-mongo-sanitize');

//MONGO CONNECT
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/YelpCamp' ;

// mongoose.connect(dbUrl)
// .then(()=>{
//     console.log("Connection Open ^_^") ;
// })

main().catch(err => console.log(err));

async function main() { 
    await mongoose.connect(dbUrl); 
}
main().then(()=>{
    console.log("Connection Open ^_^") ;
})

// Path setup
app.engine('ejs' , ejsMate) ;
app.set('view engine' , 'ejs') ;
app.set('views' , path.join(__dirname , 'views'))

//MIDDLEWARE
app.use(express.urlencoded({extended:true})) ;
app.use(methodOverride('_method')) ;
app.use(express.static(path.join(__dirname , 'public'))) ;

//Sanatize
app.use(mongoSanitize({
    replaceWith: '_'
}));

//Session Configurations ->
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

//Passport
app.use(passport.initialize()) ;
app.use(passport.session()) ;
passport.use(new LocalStrategy(User.authenticate())) ;

passport.serializeUser(User.serializeUser()) ;
passport.deserializeUser(User.deserializeUser()) ;

//Flash and Global Variables ->
app.use(flash()) ;

app.use((req , res , next) =>{

    if (req.session.returnTo){  //!!!!
        res.locals.returnTo = req.session.returnTo   //!!!!
    }
    
    res.locals.currentUser = req.user ;             // req.user can be accessed globally
    res.locals.success = req.flash('success') ;
    res.locals.error = req.flash('error') ;   
    next() ;
})

//HOME 
app.get('/' , (req , res) =>{
    res.render('campgrounds/home') ;
}) ;

//Campground Routes ->
app.use('/campgrounds' , campgroundRoutes) ;

// **************** NESTED ROUTING ****************
app.use('/campgrounds/:id/reviews' , reviewRoutes) ;

//User ->
app.use('/', userRoutes ) ;


//ERROR HANDLING
app.all('*' , (req,res , next) => {
    next(new AppError('URL not Found!!!!' , 404))
})

app.use((err , req , res , next) => {
    const {status=500 } = err ;
    if(!err.message){err.message ="Something Went Wrong!!!!!"}
    res.status(status).render('showError' , {err}) ;
})

const port = process.env.PORT || 3000;
app.listen(7000 , () => {
    console.log(`LISTENING ON PORT -> ${port} ^_^ `) ;
})