var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var auth = require('../middlewares/auth');
var upload = require('../middlewares/upload');
var ffmpeg = require('fluent-ffmpeg');

var artist = require('../models/artist');
var album = require('../models/album');
var song = require('../models/song');
var order = require('../models/order');
var env = require('../../env');

router.post('/create/artist', auth.api_require_manager, async (req, res) => {
    upload.artist_icon(req, res, (err) => {
        if (err)
            return res.json({
                code: 200,
                msg: 'Only jpg and png are allowed!',
                err: err
            });

        if (req.file === undefined || req.body.artistname === undefined || req.body.description === undefined)
            return res.json({
                code: 200,
                msg: 'missing artistname, description or no file uploaded.',
                err: err
            });

        let artistname = req.body.artistname;
        let iconpath = path.basename(req.file.path);
        let description = req.body.description || '';

        artist.create(artistname, iconpath, description).then((data) => {
            return res.json({
                code: 100,
                msg: 'create success.'
            });
        }).catch((mysqlerr) => {
            fs.unlink(req.file.path, (err) => {
                return res.json({
                    code: mysqlerr.errno,
                    msg: 'error occurred when accessing database.',
                    mysqlerr: mysqlerr
                });
            });
        });
    });
});

router.post('/edit/artist', auth.api_require_manager, async (req, res) => {
    upload.artist_icon(req, res, async (err) => {
        if (err)
            return res.json({
                code: 200,
                msg: 'Only jpg and png are allowed!',
                err: err
            });

        if (req.file === undefined || req.body.artistname === undefined || req.body.description === undefined || req.body.artistid === undefined)
            return res.json({
                code: 200,
                msg: 'missing artistid, artistname, description or no file uploaded.',
            });

        let artistid = req.body.artistid;
        let artistname = req.body.artistname;
        let iconpath = path.basename(req.file.path);
        let description = req.body.description || '';

        let artistRecord = await artist.select_by_artistid(artistid);
        if (artistRecord.length === 0) {
            return res.json({
                code: 200,
                msg: 'artistid doesn\'t exists.',
            });
        } else {
            fs.unlinkSync(path.join(env.UPLOAD_ARTIST_ICON, artistRecord[0].iconpath));
        }

        artist.edit(artistname, iconpath, description, artistid).then((data) => {
            return res.json({
                code: 100,
                msg: 'edit success.'
            });
        }).catch((mysqlerr) => {
            fs.unlink(req.file.path, (err) => {
                return res.json({
                    code: mysqlerr.errno,
                    msg: 'error occurred when accessing database.',
                    mysqlerr: mysqlerr
                });
            });
        });
    });
});



router.get('/search/artist', auth.api_require_manager, async (req, res) => {
    let artists = await artist.search(req.query.artistname);
    return res.json({
        code: 100,
        artists: artists
    });
});

router.get('/delete/artist', auth.api_require_manager, async (req, res) => {
    if (req.query.artistid === undefined)
        return res.json({
            code: 200,
            msg: 'missing artistid.'
        });

    let artistRecord = await artist.select_by_artistid(req.query.artistid);
    if (artistRecord.length === 0) {
        return res.json({
            code: 200,
            msg: 'artistid doesn\'t exists.',
        });
    } else {
        fs.unlinkSync(path.join(env.UPLOAD_ARTIST_ICON, artistRecord[0].iconpath));
    }
    artist.delete_by_artistid(req.query.artistid).then((data) => {
        return res.json({
            code: 100,
            msg: 'delete success.'
        });
    }).catch((mysqlerr) => {
        return res.json({
            code: 200,
            msg: 'error occurred when accessing database.',
            mysqlerr: mysqlerr
        });
    });
});

router.post('/create/album', auth.api_require_manager, async (req, res) => {
    upload.album_cover(req, res, (err) => {
        if (err)
            return res.json({
                code: 200,
                msg: 'Only jpg and png are allowed!'
            });
        if (req.file === undefined || req.body.albumtitle === undefined || req.body.artistid === undefined || req.body.genre === undefined)
            return res.json({
                code: 200,
                msg: 'missing albumtitle, coverpath, artistid, genre or no file uploaded.'
            });

        let albumtitle = req.body.albumtitle;
        let coverpath = path.basename(req.file.path);
        let artistid = req.body.artistid;
        let genre = req.body.genre;

        album.create(albumtitle, artistid, coverpath, genre).then((data) => {
            return res.json({
                code: 100,
                msg: 'create success.'
            });
        }).catch((mysqlerr) => {
            fs.unlink(req.file.path, (err) => {
                return res.json({
                    code: mysqlerr.errno,
                    msg: 'error occurred when accessing database.',
                    mysqlerr: mysqlerr
                });
            });
        });
    });
});

router.get('/delete/album', auth.api_require_manager, async (req, res) => {
    if (req.query.albumid === undefined)
        return res.json({
            code: 200,
            msg: 'missing albumid.'
        });
    let albumRecord = await album.select_by_albumid(req.query.albumid);
    if (albumRecord.length === 0) {
        return res.json({
            code: 200,
            msg: 'albumid doesn\'t exists.',
        });
    }

    album.delete_by_albumid(req.query.albumid).then(async (data) => {
        fs.unlink(path.join(env.UPLOAD_ALBUM_COVER, albumRecord[0].coverpath), (err) => {
            if (err) 
                return res.json({code: 300,msg: 'error delete coverpath.',err:err});
            return res.json({
                code: 100,
                msg: 'delete success.'
            });
        });
    }).catch((mysqlerr) => {
        return res.json({
            code: mysqlerr.errno,
            msg: 'error occurred when accessing database.',
            mysqlerr: mysqlerr
        });
    });
});
router.post('/edit/album', auth.api_require_manager, async (req, res) => {
    upload.album_cover(req, res, async (err) => {
        if (err)
            return res.json({
                code: 200,
                msg: 'Only jpg and png are allowed!'
            });
        if (req.file === undefined || req.body.albumtitle === undefined || req.body.albumid === undefined || req.body.genre === undefined)
            return res.json({
                code: 200,
                msg: 'missing albumtitle, artistid, genre or no file uploaded.',
            });

        let albumtitle = req.body.albumtitle;
        let coverpath = path.basename(req.file.path);
        let albumid = req.body.albumid;
        let genre = req.body.genre;

        let albumRecord = await album.select_by_albumid(albumid);
        if (albumRecord.length === 0) {
            return res.json({
                code: 200,
                msg: 'albumid doesn\'t exists.',
            });
        }

        album.edit(albumtitle, genre, coverpath, albumid).then(async (data) => {
            fs.unlinkSync(path.join(env.UPLOAD_ALBUM_COVER, albumRecord[0].coverpath));
            return res.json({
                code: 100,
                msg: 'edit success.'
            });
        }).catch((mysqlerr) => {
            fs.unlink(req.file.path, (err) => {
                return res.json({
                    code: mysqlerr.errno,
                    msg: 'error occurred when accessing database.',
                    mysqlerr: mysqlerr
                });
            });
        });
    });
});
router.get('/get/album', auth.api_require_manager, async (req, res) => {
    let albums = await album.find_by_artistid(req.query.artistid);
    return res.json({
        code: 100,
        albums: albums
    });
});

router.post('/create/song', auth.api_require_manager, async (req, res) => {
    upload.song(req, res, (err) => {
        if (err)
            return res.json({
                code: 200,
                msg: 'Only m4a and mp3 are allowed!'
            });
        if (req.file === undefined || req.body.songtitle === undefined || req.body.albumid === undefined || req.body.price === undefined)
            return res.json({
                code: 200,
                msg: 'missing songtitle, albumid, price or no file uploaded.'
            });

        let filepath = req.file.path;
        let prefilepath = path.join(env.UPLOAD_AUDIO_PREVIEW, path.basename(filepath));
        let songtitle = req.body.songtitle;
        let albumid = req.body.albumid;
        let price = req.body.price;

        ffmpeg({
                source: filepath
            })
            .setStartTime(0)
            .setDuration(30)
            .outputOptions(['-c copy'])
            .on("start", function (commandLine) {
                console.log("Spawned FFmpeg with command: " + commandLine);
            }).on("error", function (err) {
                console.log("error: ", +err);
            }).on("end", function (err) {
                if (!err) console.log("conversion Done");
                song.create(songtitle, albumid, path.basename(filepath), price).then((data) => {
                    return res.json({
                        code: 100
                    });
                }).catch((mysqlerr) => {
                    fs.unlink(req.file.path, (err) => {
                        return res.json({
                            code: mysqlerr.errno,
                            msg: 'error occurred when accessing database.',
                            mysqlerr: mysqlerr
                        });
                    });
                });
            }).saveToFile(prefilepath);
    });
});

router.post('/edit/song', auth.api_require_manager, async (req, res) => {
    upload.song(req, res, async (err) => {
        if (err)
            return res.json({
                code: 200,
                msg: 'Only m4a and mp3 are allowed!'
            });
        if (req.file === undefined || req.body.songtitle === undefined || req.body.price === undefined || req.body.songid === undefined)
            return res.json({
                code: 200,
                msg: 'missing songtitle, songid, price or no file uploaded.'
            });

        let filepath = req.file.path;
        let prefilepath = path.join(env.UPLOAD_AUDIO_PREVIEW, path.basename(filepath));
        let songtitle = req.body.songtitle;
        let albumid = req.body.albumid;
        let price = req.body.price;
        let songid = req.body.songid;

        let songRecord = await song.select_by_songid(songid);
        if (songRecord.length === 0) {
            return res.json({
                code: 200,
                msg: 'songid doesn\'t exists.',
            });
        }

        ffmpeg({
                source: filepath
            })
            .setStartTime(0)
            .setDuration(30)
            .outputOptions(['-c copy'])
            .on("start", function (commandLine) {
                console.log("Spawned FFmpeg with command: " + commandLine);
            }).on("error", function (err) {
                console.log("error: ", +err);
            }).on("end", function (err) {
                if (!err) console.log("conversion Done");
                song.edit(songtitle, price, path.basename(filepath), songid).then(async (data) => {
                    fs.unlinkSync(path.join(env.UPLOAD_AUDIO_PREVIEW, songRecord[0].filepath));
                    fs.unlinkSync(path.join(env.UPLOAD_AUDIO_COMPLETE, songRecord[0].filepath));
                    return res.json({
                        code: 100,
                        msg: 'edit success'
                    });
                }).catch((mysqlerr) => {
                    fs.unlink(req.file.path, (err) => {
                        return res.json({
                            code: mysqlerr.errno,
                            msg: 'error occurred when accessing database.',
                            mysqlerr: mysqlerr
                        });
                    });
                });
            }).saveToFile(prefilepath);
    });
});



router.get('/delete/song', auth.api_require_manager, async (req, res) => {
    if (req.query.songid === undefined)
        return res.json({
            code: 200,
            msg: 'missing songid'
        });

    let songRecord = await song.select_by_songid(req.query.songid);
    if (songRecord.length === 0) {
        return res.json({
            code: 200,
            msg: 'songid doesn\'t exists.',
        });
    } else {
        fs.unlinkSync(path.join(env.UPLOAD_AUDIO_PREVIEW, songRecord[0].filepath));
        fs.unlinkSync(path.join(env.UPLOAD_AUDIO_COMPLETE, songRecord[0].filepath));
    }
    song.delete_by_songid(req.query.songid).then(data => {
        return res.json({
            code: 100,
            msg: 'delete success'
        });
    }).catch(mysqlerr => {
        return res.json({
            code: 300,
            msg: 'error occurred when accessing database.',
            mysqlerr: mysqlerr
        });
    });

});

router.get('/get/song', auth.api_require_manager, async (req, res) => {
    let songs = await song.search_by_albumid(req.query.albumid);
    return res.json({
        code: 100,
        songs: songs
    });
});


module.exports = router;