const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const util = require('../util');
const env = util.env;


router.get('', (req, res, next) => {

    let redirectPath = path.dirname(req.query.newpath);

    if(!req.query.oldpath || !req.query.newpath)
        return res.redirect(redirectPath +'?err=Missing query parameters oldpath or newpath.');
        
    let oldPath = path.normalize(path.join(env.ROOT,req.query.oldpath));
    let newPath = path.normalize(path.join(env.ROOT,req.query.newpath));

    if(!fs.existsSync(oldPath))
        return res.redirect(redirectPath +'?err=File or folder does not exist in current directory.');

    if(!util.isSubDirOf(newPath, env.SHARE_ROOT) || newPath === env.SHARE_ROOT)
        return res.redirect('/share?err=you do not have permission to access this directory.');

    if(fs.existsSync(newPath))
        return res.redirect(redirectPath + '?err="' + util.splitPath(newPath).pop() + '" already exist in current directory.');
    
    fs.rename(oldPath, newPath, (err) => {
        return res.redirect(err ? redirectPath + '?err=' + err : redirectPath);
    });
});

module.exports = router;