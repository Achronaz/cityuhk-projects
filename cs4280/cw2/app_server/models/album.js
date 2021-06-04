var connection = require('./connection');
const create = (albumtitle, artistid, coverpath, genre) => {
    return new Promise(function (resolve, reject) {
        var sql = "insert into album values(DEFAULT,?,?,?,?,now());";
        connection.query(sql, [albumtitle, artistid, coverpath, genre], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

var find_by_artistid = (artistid) => {
    var sql = "select * from album join artist using(artistid) where artistid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [artistid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

var search_by_albumtitle = (albumtitle) => {
    var sql = "select * from song join album using(albumid) join artist using(artistid) where albumtitle like concat(?, '%')";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [albumtitle], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

var find = (artistname, albumtitle) => {
    var sql = "select * from album join artist using(artistid) where artistname = ? and albumtitle = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [artistname, albumtitle], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

var edit = (albumtitle, genre, coverpath, albumid) => {
    var sql = "update album set albumtitle = ?, genre = ?, coverpath = ? where albumid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [albumtitle, genre, coverpath, albumid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}
var delete_by_albumid = (albumid) => {
    var sql = "delete from album where albumid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [albumid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

var random_select = (limit) =>{
    let sql = "select * from album join artist using(artistid) order by rand() limit ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [limit], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    }); 
}

var select_by_albumid = (albumid) =>{
    let sql = "select * from album where albumid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [albumid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    }); 
}
var exists = (albumid) => {
    let sql = "select count(*) from album where albumid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [albumid], function (err, result) {
            if (err) reject(err);
            else resolve(result.length > 0);
        });
    });    
}
module.exports = {
    create,
    search_by_albumtitle,
    find_by_artistid,
    find,
    edit,
    delete_by_albumid,
    random_select,
    select_by_albumid,
    exists
}