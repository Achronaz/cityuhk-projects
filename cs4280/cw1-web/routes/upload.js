const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer  = require('multer');
const util = require('../util');
const env = util.env;

const upload = multer({ dest: env.TEMP_ROOT });

router.post('', upload.single('file'), (req, res, next) => {

    let redirectPath = req.body.dir;

    let tempPath = req.file.path;
    let newPath = path.normalize(path.join(env.ROOT, redirectPath + '\\' + req.file.originalname));

    let fileExist = fs.existsSync(newPath);
    let higherLevelAccess = !util.isSubDirOf(newPath, env.SHARE_ROOT);

    if (fileExist || higherLevelAccess){
        fs.unlink(tempPath, (err) => { if(err) throw err; });
        let errMsg = '';
        if(fileExist) errMsg += 'file already exist in directory.<br>' ;
        if(higherLevelAccess) errMsg += 'you do not have permission to access.';
        return res.redirect(redirectPath + '?err=' +errMsg);
    }
    
    fs.rename(tempPath, newPath, (err) => {
        return res.redirect(err ? redirectPath +'?err='+ err : redirectPath);
    });
    
});

module.exports = router;