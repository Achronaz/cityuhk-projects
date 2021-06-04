var path = require('path');
var order = require('../models/order');
var page_require_signin = (req, res, next) => {
    if(req.session.user === undefined){
        res.locals.title = 'Error Page';
        res.locals.page = 'page_error';
        res.locals.user = req.session.user;
        res.locals.err = {
            code: 403,
            title: 'Forbidden',
            msg:'Please signin first.'
        };
        return res.render('template');
    }
    next();
}
var page_require_manager = (req, res, next) => {
    if(req.session.user === undefined || req.session.user.permission !== 1){
        res.locals.title = 'Error Page';
        res.locals.page = 'page_error';
        res.locals.user = req.session.user;
        res.locals.err = {
            code: 403,
            title: 'Forbidden',
            msg:'you do not have permission to access this page.'
        };
        return res.render('template');
    }
    next();
}

var api_require_signin = (req, res, next) => {
    if(req.session.user === undefined){
        return res.json({code:200,msg:"you don\'t have permission to access."});
    }
    next();
}

var api_require_manager = (req, res, next) => {
    if(req.session.user === undefined || req.session.user.permission !== 1){
        return res.json({code:200,msg:"you don\'t have permission to access."});
    }
    next();
}

//when user access /audio/complete
//songid
var api_require_purchased = async (req, res, next) =>{
    let requestFile = req.url.split('/').pop();

    if(req.session.user === undefined )
        return res.redirect('/source/preview/'+requestFile);
    if(req.session.user.permission === 1)
        return next();
    
    if(req.query.songid === undefined || req.query.albumid === undefined){
        return res.redirect('/source/preview/'+requestFile);
    }
    
    let purchasedItem = await order.get_purchased(req.session.user.userid);
    
    for(var i=0; i<purchasedItem.length; i++){
        if((purchasedItem[i].songid == req.query.songid || purchasedItem[i].albumid == req.query.albumid) && 
            purchasedItem[i].refund == 0){
            return next();
        }
    }
    
    return res.redirect('/source/preview/'+requestFile);
    
}
module.exports = {
    page_require_signin,
    page_require_manager,
    api_require_signin,
    api_require_manager,
    api_require_purchased
}