const connection = require('./connection');

const create = (userid,id,payment_method,option) => {
    let sqls = {
        album:'insert into `order` values(default,?,null,?,?,now(),default)',
        song:'insert into `order` values(default,?,?,null,?,now(),default)'
    }
    return new Promise(function (resolve, reject) {
        connection.query(sqls[option], [userid,id,payment_method], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

const get_purchased = (userid) => {
    let sql = "select * from `order` where userid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql, [userid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

const get_count = (option) => {
    let sqls = {
        sales:'select count(*) as count from `order`',
        point:'select count(*) as count from `order` where paymentstatus = 2',
        card:'select count(*) as count from `order` where paymentstatus = 1',
        refund:'select count(*) as count from `order` where refund = 1'
    }
    return new Promise(function (resolve, reject) {
        connection.query(sqls[option],[], function (err, result) {
            console.log(result);
            if (err) reject(err);
            else resolve(result);
        });
    });  
}
const get_by_orderid = (orderid) =>{
    let sql = "select * from `order` where orderid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql,[orderid], function (err, result) {
            console.log(result);
            if (err) reject(err);
            else resolve(result);
        });
    });    
}
const set_refund = (val,orderid) => {
    let sql = "update `order` set refund = ? where orderid = ?";
    return new Promise(function (resolve, reject) {
        connection.query(sql,[val,orderid], function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });  
}

module.exports = {
    create,
    get_purchased,
    get_count,
    get_by_orderid,
    set_refund
}