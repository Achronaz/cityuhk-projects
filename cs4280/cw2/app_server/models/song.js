var connection = require('./connection');

var create = (songtitle, albumid, filepath, price) => {
    return new Promise(function (resolve, reject) {
        var sql = "insert into song values(DEFAULT,?,?,?,?);";
        connection.query(sql, [songtitle, albumid, filepath, price], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

var search_by_songid = (songid) => {
    var sql = "select * from song join album using(albumid) join artist using(artistid) where songid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [songid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

var search_by_albumid = (albumid) => {
    var sql = "select * from song join album using(albumid) join artist using(artistid) where albumid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [albumid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

var search_by_songtitle = (songtitle) => {
    var sql = "select * from song join album using(albumid) join artist using(artistid) where songtitle like concat(?, '%')";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [songtitle], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}
const get_price = (songid) => {
    return new Promise(function (resolve, reject) {
        let sql = "select price from song where songid = ?";
        connection.query(sql, [songid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}
const delete_by_songid = (songid) => {
    return new Promise(function (resolve, reject) {
        let sql = "delete from song where songid = ?";
        connection.query(sql, [songid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    }); 
}

const select_by_songid = (songid) => {
    return new Promise(function (resolve, reject) {
        let sql = "select * from song where songid = ?";
        connection.query(sql, [songid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}
const edit = (songtitle,price,filepath,songid) =>{
    return new Promise(function (resolve, reject) {
        let sql = "update song set songtitle = ?, price = ?, filepath = ? where songid = ?";
        connection.query(sql, [songtitle,price,filepath,songid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });
}
const get_price_by_albumid = (albumid) =>{
    return new Promise(function (resolve, reject) {
        let sql = "select sum(price) as price from song where albumid = ?";
        connection.query(sql, [albumid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });   
}
var exists = (songid) => {
    let sql = "select count(*) from song where songid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [songid], function (err, result) {
            if (err) reject(err);
            else resolve(result.length > 0);
        });
    });    
}

module.exports = {
    create,
    search_by_songid,
    search_by_albumid,
    search_by_songtitle,
    get_price,
    delete_by_songid,
    select_by_songid,
    edit,
    get_price_by_albumid,
    exists
}