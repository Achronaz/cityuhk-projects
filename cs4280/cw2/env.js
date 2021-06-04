const path = require('path');

const ROOT = path.normalize(path.join(__dirname, ''));
const UPLOAD_AUDIO_COMPLETE = path.normalize(path.join(__dirname, 'source/complete'));
const UPLOAD_AUDIO_PREVIEW = path.normalize(path.join(__dirname, 'source/preview'));
const UPLOAD_ALBUM_COVER = path.normalize(path.join(__dirname, 'source/album_cover'));
const UPLOAD_ARTIST_ICON = path.normalize(path.join(__dirname, 'source/artist_icon'));

const MYSQLHOST = 'localhost';
const MYSQLPORT = 3306;
const MYSQLUSER = 'root';
const MYSQLPWD = '123741456852';
const MYSQLDB = '4280db';

//provide absolute path const
module.exports = {
    ROOT,
    UPLOAD_AUDIO_COMPLETE,
    UPLOAD_AUDIO_PREVIEW,
    UPLOAD_ALBUM_COVER,
    UPLOAD_ARTIST_ICON,
    MYSQLHOST,
    MYSQLPORT,
    MYSQLUSER,
    MYSQLPWD,
    MYSQLDB,
}