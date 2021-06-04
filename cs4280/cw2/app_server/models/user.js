const connection = require('./connection');
const bcrypt = require('bcrypt');

const find = (username, password) => {
    return new Promise(function (resolve, reject) {
        let sql = "select * from user where username = ? limit 1";
        connection.query(sql, [username], function(err, result, fields) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                let user = result[0];
                   
                if(user !== undefined && bcrypt.compareSync(password, user.password)){
                    resolve({
                        user: {
                            userid: user.userid,
                            username: user.username,
                            loyaltypoints: user.loyaltypoints,
                            permission: user.permission
                        }
                    });
                }else{
                    resolve({});
                }
            }
        });
    });  
}

const register = (username, password, premission) => {
    return new Promise(function (resolve, reject) {
        var sql = "insert into user values(default, ?, ?, 0, ?)";
        connection.query(sql, [username, bcrypt.hashSync(password, 10), premission], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

const exists = (username) => {
    return new Promise(function (resolve, reject) {
        let sql = "select * from user where username = ? limit 1;";
        connection.query(sql, [username], function (err, result) {
            if (err) reject(err);
            else resolve(result.length > 0);
        });
    });  
}/*
const add_points = (ponits,userid) => {
    return new Promise(function (resolve, reject) {
        let sql = "update `user` set loyaltypoints = loyaltypoints + ? where userid = ?";
        connection.query(sql, [ponits,userid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}*/
const get_points = (userid) => {
    return new Promise(function (resolve, reject) {
        let sql = "select loyaltypoints from user where userid = ?";
        connection.query(sql, [userid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}
const set_points = (points,userid) => {
    return new Promise(function (resolve, reject) {
        let sql = "update user set loyaltypoints = ? where userid = ?";
        connection.query(sql, [parseInt(points),userid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}


module.exports = {
    find,
    register,
    exists,
    //add_points,
    get_points,
    set_points
}