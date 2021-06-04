const express = require('express');
const router = express.Router({mergeParams: true});
const path = require('path');
const fs = require('fs');
const util = require('../util');
const env = util.env;
const render = require('../render');

router.get('', (req, res) => {
    
    //if (req.params[0] === '') return res.redirect('/share');

    let requestPath = req.params[0];

    let pathname = path.normalize(path.join(env.ROOT, requestPath));

    if (!fs.existsSync(pathname))
        return res.redirect('/share?err=no such file or directory.');
    
    if(requestPath !== 'share' && !util.isSubDirOf(pathname,env.SHARE_ROOT)) 
        return res.redirect('/share?err=you do not have permission to access this directory.');
    
    let isDirectory = fs.lstatSync(pathname).isDirectory();
    if (isDirectory) {
        let files = fs.readdirSync(pathname, (err) => {
            if (err) throw err;
        });
        let filesTemp = [];
        files.forEach((file) => {
            let stats = fs.statSync(path.join(pathname, file), (err) => {
                if (err) throw err;
            });
            filesTemp.push({
                isFile: stats.isFile(),
                name: file,
                size: stats.size,
                mtime: stats.mtime.toISOString().slice(0, 19).replace('T', ' '),
                href: `${path.normalize(requestPath).replace(/[\\|\/]/ig,'/')}/${file}`
            });
        });
        var errMsg = req.query.err || '';
        return res.send(render.template(filesTemp, requestPath, errMsg, errMsg !== ''));

    } else {
        if (req.query.o === 'download')
            return res.download(pathname);
        else
            return res.sendFile(pathname);
    }

});

module.exports = router;