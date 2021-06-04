const express = require('express');
const router = express.Router();
const order = require('../models/order');
const song = require('../models/song');
const user = require('../models/user');
const album = require('../models/album');
const auth = require('../middlewares/auth');

// payment_method(1):credit card, payment_method(2):points
router.get('/song', async (req, res) => {
    if(req.session.user === undefined)
        return res.json({code: 201,msg: 'please login first'});
    if (req.query.payment_method === undefined || req.query.songid === undefined) 
        return res.json({code: 200,msg: 'missing payment method or songid.'});
    
    let songid = req.query.songid;
    if(!(await song.exists(songid)))
        return res.json({code: 200,msg: 'song doesn\'t exists.'});
    
    let userid = req.session.user.userid;
    let payment_method = req.query.payment_method;

    let price = (await song.get_price(songid))[0].price;
    let points = req.session.user.loyaltypoints;
    if (payment_method == 2 && points < price) 
        return res.json({ code: 200, msg: 'Point is not enough.'});

    order.create(userid, songid, payment_method, 'song').then(async (data) => {
        points = payment_method == 2 ? points - price : points + price / 8;
        await user.set_points(points, userid);
        req.session.user.loyaltypoints = points;
        return res.json({code: 100,msg: 'order success.'});
    }).catch((err) => {
        return res.json({code: 300,msg: 'error occured when accessing database aa',err: err});
    }); 
});
    

router.get('/album', async (req, res) => {
    if(req.session.user === undefined)
        return res.json({code: 201,msg: 'please login first'});
    if (req.query.payment_method === undefined || req.query.albumid === undefined) 
        return res.json({code: 200,msg: 'missing payment method or albumid.'});
    
    let albumid = req.query.albumid;
    if(!(await album.exists(albumid)))
        return res.json({code: 200,msg: 'album doesn\'t exists.'});
    
    let userid = req.session.user.userid;
    let payment_method = req.query.payment_method;

    let price = (await song.get_price_by_albumid(albumid))[0].price;
    let points = req.session.user.loyaltypoints;

    if (payment_method == 2 && points < price) 
        return res.json({ code: 200, msg: 'Point is not enough.'});

    order.create(userid, albumid, payment_method, 'album').then(async (data) => {
        points = payment_method == 2 ? points - price : points + price / 8;
        await user.set_points(points, userid);
        req.session.user.loyaltypoints = points;
        return res.json({code: 100,msg: 'order success.'});
    }).catch((err) => {
        return res.json({code: 300,msg: 'error occured when accessing database aa',err: err});
    });
});

router.get('/refund', auth.api_require_signin, async (req, res) => {
    if (req.query.orderid === undefined) {
        return res.json({
            code: 200,
            msg: 'missing orderid.'
        });
    }
    let orderid = req.query.orderid;
    let userid = req.session.user.userid;
    let orderRecord = await order.get_by_orderid(orderid);
    if (orderRecord.length === 0)
        return res.json({code: 200,msg: 'order doesn\'t exists.'});
    
    if(orderRecord[0].userid !== userid)
        return res.json({code: 200,msg: 'Order does not belong to you.'});

    if (orderRecord[0].paymentstatus === 2) 
        return res.json({code: 200, msg: 'loyalty points purchase cannot be refunded.'});
    
    if (orderRecord[0].songid !== null) 
        return res.json({code: 200,msg: 'song purchase cannot be refunded.'});
    
    if ((new Date() - new Date(orderRecord[0].puchasedate)) > 259200000) 
        return res.json({code: 200,msg: 'only order within 3 days can be refunded.'});
    
    order.set_refund(1,orderid).then(data => {
        return res.json({code: 100,msg: 'refund success'});
    }).catch(err => {
        return res.json({code: 300,msg: 'db error',err: err});
    });

});

router.get('/cancel/refund', auth.api_require_signin, async (req, res) => {
    if (req.query.orderid === undefined) 
        return res.json({code: 200,msg: 'missing orderid.'});
    
    let orderid = req.query.orderid;
    let userid = req.session.user.userid;
    let orderRecord = await order.get_by_orderid(orderid);
    if (orderRecord.length === 0)
        return res.json({code: 200,msg: 'order doesn\'t exists.'});
    
    if(orderRecord[0].userid !== userid)
        return res.json({code: 200,msg: 'Order does not belong to you.'});
    
    order.set_refund(0,orderid).then(data => {
        return res.json({code: 100,msg: 'cancel refund success'});
    }).catch(err => {
        return res.json({code: 300,msg: 'db error',err: err});
    });

});



module.exports = router;