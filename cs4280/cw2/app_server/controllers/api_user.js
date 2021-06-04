const express = require('express');
const router = express.Router();
const user = require('../models/user');
const order = require('../models/order');
const auth = require('../middlewares/auth');

router.post('/signup', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let repeatpassword = req.body.repeatpassword;

    if(!username.match(/^[\w]{6,32}$/))
        return res.json({
            code: 200,
            msg: 'Username must consist of alphanumeric and underscores between 6 and 32 in length.'
        });
    
    if (!user.exists(username)) 
        return res.json({
            code: 200,
            msg: 'username already exists.'
        });

    if(password.length < 6 || password.length > 32)
        return res.json({
            code: 200,
            msg: 'The length of password must between 6 and 32.'
        });
    
    if (password !== repeatpassword) 
        return res.json({
            code: 200,
            msg: 'password and repeat password not match.'
        });

    user.register(username, password, 0)
        .then((data) => {
            res.json({
                code: 100,
                msg: 'registration success.'
            });
        }).catch((err) => {
            res.json({
                code: 300,
                msg: 'error occurred when accessing database.',
                detail: err
            });
        });
});

router.post('/signin', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username === '' || password === '')
        return res.json({
            code: 200,
            msg: 'missing username or password.'
        });

    let data = await user.find(username, password).catch((err)=>{
        if(err) throw err;
    });
    if(data.user === undefined)
        return res.json({
            code: 200,
            msg: 'username or password wrong.'
        });
    
    req.session.user = data.user;
    req.session.purchased = JSON.parse(JSON.stringify(await order.get_purchased(data.user.userid)))
    console.log(req.session.purchased);
    return res.json({code: 100});
});

router.post('/signout', (req, res) => {
    req.session.destroy();
    res.clearCookie('session_cookie_name');
    return res.json({
        code: 100,
        msg: 'signout success',
    });
});

module.exports = router;