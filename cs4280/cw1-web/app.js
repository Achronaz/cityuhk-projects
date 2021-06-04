const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();


const newRouter = require('./routes/new');
const deleteRouter = require('./routes/del');
const renameRouter = require('./routes/rename');
const uploadRouter = require('./routes/upload');
const dirRouter = require('./routes/dir');

const util = require('./util');
const env = util.env;

app.use('/src', express.static(path.join(__dirname,'src')));

app.get('/',(req,res)=>{
    return res.sendFile(path.join(__dirname,'./src/index.html'));
});

app.use('/new', newRouter);
app.use('/delete', deleteRouter);
app.use('/rename', renameRouter);
app.use('/upload', uploadRouter);
app.use('/*', dirRouter);

app.listen(3000, () => {
    if (!fs.existsSync(env.SHARE_ROOT)) fs.mkdirSync(env.SHARE_ROOT);
    if (!fs.existsSync(env.SHARE_ROOT)) fs.mkdirSync(env.TEMP_ROOT);
    console.log('App listening on port 3000!');
});