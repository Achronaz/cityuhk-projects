const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const util = require('../util');
const env = util.env;

router.get('', (req, res, next) => {

    let redirectPath = path.dirname(req.query.filepath);

    if (!req.query.filepath)
        return res.redirect(redirectPath + '?err=Missing query parameters filepath.');

    let pathname = path.normalize(path.join(env.ROOT, req.query.filepath));

    if (!util.isSubDirOf(pathname, env.SHARE_ROOT))
        return res.redirect('/share?err=you do not have permission to access this directory.');

    if (!fs.existsSync(pathname))
        return res.redirect(redirectPath + '?err=No such file or directory: ' + req.query.filepath);

    let isDirectory = fs.lstatSync(pathname).isDirectory();

    if (isDirectory) {
        fs.rmdir(pathname, (err) => {
            if (err && err.code === 'ENOTEMPTY')
                return res.redirect(redirectPath + '?err=Directory not empty.');
            return res.redirect(redirectPath);
        });
    } else {
        fs.unlink(pathname, (err) => {
            return res.redirect(err ? redirectPath + '?err=' + err : redirectPath);
        });
    }
    
});

module.exports = router;