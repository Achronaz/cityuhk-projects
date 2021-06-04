const connection = require('./connection');
const create = (artistname, iconpath, artistdesc) => {
    return new Promise(function (resolve, reject) {
        var sql = "insert into artist values(DEFAULT,?,?,?);";
        connection.query(sql, [artistname, iconpath, artistdesc], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });
}
const search = (artistname) => {
    var sql = "select * from artist where artistname like concat(?, '%')";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [artistname], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}
const find = (artistname) => {
    var sql = "select * from artist where artistname = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [artistname], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}
const search_by_artistname = (artistname) =>{
    let sql = "select * from song join album using(albumid) join artist using(artistid) where artistname like concat(?, '%')";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [artistname], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}
var delete_by_artistid = (artistid) => {
    var sql = "delete from artist where artistid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [artistid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

const edit = (artistname, iconpath, description, artistid) => {
    var sql = "update artist set artistname = ?, iconpath = ?, description = ? where artistid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [artistname, iconpath, description, artistid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    }); 
}
const select_by_artistid = (artistid) => {
    var sql = "select * from artist where artistid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [artistid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    }); 
}

module.exports = {
    create,
    search,
    find,
    search_by_artistname,
    delete_by_artistid,
    edit,
    select_by_artistid
}