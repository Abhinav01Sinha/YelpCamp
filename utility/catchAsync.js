module.exports = function wrapAsync(fn){
    return (res , req , next )=> {
        fn(res , req, next)
        .catch(e => {
            console.log(e) ;
            next(e) ;
        })
    }
}

