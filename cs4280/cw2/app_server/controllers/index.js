const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const artist = require('../models/artist');
const album = require('../models/album');
const song = require('../models/song');
const order = require('../models/order');

router.get('/', async (req, res) => {
    res.locals.title = 'Home Page';
    res.locals.page = 'page_home';
    res.locals.user = req.session.user;

    res.locals.collapse = await album.random_select(5);
    res.locals.trending = await album.random_select(5);
    res.locals.recommended = await album.random_select(5);

    return res.render('template');
});

router.get('/history', auth.page_require_signin, async (req, res) => {

    let user = req.session.user;
    let purchased_items = [];
    let purchased = await order.get_purchased(user.userid);
    console.log(purchased);
    for(var i=0; i<purchased.length; i++){
        let temp = [];
        if(purchased[i].songid == null){
            temp = await album.select_by_albumid(purchased[i].albumid);
            purchased_items[i] = {
                type:'Album',
                name:temp[0].albumtitle,
                price: (await song.get_price_by_albumid(purchased[i].albumid))[0].price
            };
        }else{
            temp = await song.select_by_songid(purchased[i].songid);
            purchased_items[i] = {
                type:'Song',
                name:temp[0].songtitle,
                price:temp[0].price
            };
        }
    }

    res.locals.title = 'History Page';
    res.locals.page = 'page_history';
    res.locals.user = user;
    res.locals.purchased_items = purchased_items;
    res.locals.purchased = purchased;
    return res.render('template');
});

router.get('/statistic', auth.page_require_manager, async (req, res) => {
    res.locals.title = 'Statistic Page';
    res.locals.page = 'page_statistic';
    res.locals.user = req.session.user;

    res.locals.stat = {
        sales: (await order.get_count('sales'))[0].count,
        point: (await order.get_count('point'))[0].count,
        card:(await order.get_count('card'))[0].count,
        refund: (await order.get_count('refund'))[0].count
    }

    return res.render('template');
});

router.get('/manage', auth.page_require_manager, (req, res) => {
    res.locals.title = 'Manage Page';
    res.locals.page = 'page_manage';
    res.locals.user = req.session.user;
    return res.render('template');
});

router.get('^/search/:option(song|album|artist)/:key', async (req, res) => {
    let option = req.params.option;
    let key = req.params.key;
    let result = [];
    if (option === 'song') {
        result = await song.search_by_songtitle(key);
    } else if (option === 'album') {
        result = await album.search_by_albumtitle(key);
    } else { // option === 'artist'
        result = await artist.search_by_artistname(key);
    }
    let artists = formatData(result);

    //return res.json({result: result,artists: artists});
    res.locals.title = 'Search Page';
    res.locals.page = 'page_search';
    if(req.session.user !== undefined){
        res.locals.user = req.session.user;
        res.locals.purchased = await order.get_purchased(req.session.user.userid);
        
    }else{
        res.locals.user = undefined;
        res.locals.purchased = [];
    }
    
    res.locals.searchOption = option;
    res.locals.searchKey = key;
    res.locals.artists = artists;
    return res.render('template');
});

function escapeHtml(unsafe) {
    return unsafe
        .replace('"', '\\\"')
        .replace("'", "\\\'");
}

function formatData(result) {
    let artists = [];
    //map artists
    result.forEach(item => {
        let exists = artists.find(artist=>{
            return artist.artistid == item.artistid;
        });
        if(!exists){
            console.log('push');
            artists.push({
                artistid: item.artistid,
                artistname: escapeHtml(item.artistname),
                iconpath: item.iconpath,
                description: escapeHtml(item.description),
                albums: []
            });
        }
    });
    //map albums
    result.forEach(item => {
        artists.forEach(artist => {
            let exists = artist.albums.find(album=>{
                return album.albumid == item.albumid;
            });
            if(!exists && artist.artistid == item.artistid){
                artist.albums.push({
                    albumid: item.albumid,
                    albumtitle: escapeHtml(item.albumtitle),
                    coverpath: item.coverpath,
                    genre: escapeHtml(item.genre),
                    releasedate: item.releasedate,
                    songs: []
                });
            }
        });
    });
    //map songs
    result.forEach(item => {
        artists.forEach(artist => {
            artist.albums.forEach(album => {
                if (artist.artistid == item.artistid && album.albumid == item.albumid) {
                    album.songs.push({
                        songid: item.songid,
                        songtitle: escapeHtml(item.songtitle),
                        filepath: item.filepath,
                        price: item.price
                    });
                }
            });
        });
    });
    /*
    artists:[
        {
            artistid:artistid,
            artistname:artistname,
            iconpath:iconpath,
            description:description,
            albums:[
                {
                    albumid:albumid,
                    albumtitle:albumtitle,
                    coverpath:coverpath,
                    genre:genre,
                    releasedate:releasedate,
                    songs:[
                        {
                            songid:songid,
                            songtitle:songtitle,
                            filepath:filepath,
                            price:price
                        }
                    ]
                }
            ]
        }
    ]
*/
    return artists;
}

module.exports = router;