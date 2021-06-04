var env = require('../../env');
var path = require('path');
var multer = require('multer');

var artist_icon = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, env.UPLOAD_ARTIST_ICON);
        },
        filename: function (req, file, cb) {
            cb(null, [...Array(32)].map(i => (~~(Math.random() * 36)).toString(36)).join('') + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: function (req, file, cb) {
        if (!/\.(jpg|png)$/.test(file.originalname.toLowerCase()))
            return cb(new Error('only jpg and png are allowed!'), false);
        cb(null, true);
    }
}).single('image');

var album_cover = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, env.UPLOAD_ALBUM_COVER);
        },
        filename: function (req, file, cb) {
            cb(null, [...Array(32)].map(i => (~~(Math.random() * 36)).toString(36)).join('') + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: function (req, file, cb) {
        if (!/\.(jpg|png)$/.test(file.originalname.toLowerCase()))
            return cb(new Error('only jpg and png are allowed!'), false);
        cb(null, true);
    }
}).single('image');

var song = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, env.UPLOAD_AUDIO_COMPLETE);
        },
        filename: function (req, file, cb) {
            cb(null, [...Array(32)].map(i => (~~(Math.random() * 36)).toString(36)).join('') + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter: function (req, file, cb) {
        if (!/\.(m4a|mp3)$/.test(file.originalname.toLowerCase()))
            return cb(new Error('only m4a and mp3 are allowed!'), false);
        cb(null, true);
    }
}).single('audio');

module.exports = {
    artist_icon,
    album_cover,
    song
}