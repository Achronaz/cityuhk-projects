const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const util = require('../util');
const env = util.env;

router.get('', (req, res, next) => {

    let redirectPath = path.dirname(req.query.filepath);

    if(!req.query.filepath)
        return res.redirect(redirectPath + '?err=Missing query parameters filepath.');

    let newPath = path.normalize(path.join(env.ROOT, req.query.filepath));

    if(!util.isSubDirOf(newPath,env.SHARE_ROOT))
        return res.redirect('/share?err=you do not have permission to access this directory.');

    if(fs.existsSync(newPath))
        return res.redirect(redirectPath + '?err=file or folder already exist in this directory.');

    if (path.extname(newPath)==='') {
        fs.mkdir(newPath, {recursive: true}, (err) => {
            if(err) throw err;
            return res.redirect(redirectPath);
        });
    } else {
        fs.writeFile(newPath, '', (err) => {
            if (err && err.code === 'ENOENT') {
                fs.mkdir(path.dirname(newPath), {recursive: true}, (err) => {
                    if (err) throw err;
                    fs.writeFile(newPath, '', (err) => {
                        if (err) throw err;
                    });
                });
            }
        });
        return res.redirect(redirectPath);
    }
});

module.exports = router;