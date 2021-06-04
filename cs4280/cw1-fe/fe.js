const fs = require('fs');
const path = require('path');
const ROOT_DIR = path.join(__dirname, 'share');
var CURR_PATH = ROOT_DIR;
const readline = require('readline');
const events = require('events');
const emitter = new events.EventEmitter();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/*
 * util
 */

//string suffix space formatter
const format = (str, n) => {
    let space = '';
    for (var i = 0; i < n - str.length; i++) space += ' ';
    return str + space;
}

//check "child" is subdiectory of "parent"
const isSubDirOf = (child, parent) => {
    if (child === parent) return false;
    const parentTokens = parent.split(path.sep).filter(i => i.length);
    return parentTokens.every((t, i) => child.split(path.sep)[i] === t);
}

//prefix prompt for showing current directory
const prompt = () => {
    rl.setPrompt('FE '+CURR_PATH +'> ');
    rl.prompt();
}

//refresh the status of current directory
const refreshScreen = (msg) => {
    emitter.emit('readdir', CURR_PATH);
    if(msg) console.log(msg);
    prompt();
}

/*
 * emitter
 */

emitter.on('readdir', (pathname) => {

    let isDirectory = fs.lstatSync(pathname).isDirectory();
    CURR_PATH = isDirectory ? pathname : path.dirname(pathname);

    if (isDirectory) {
        let files = fs.readdirSync(pathname, (err) => { if (err) throw err; });
        console.log(format('Type', 4), format('File', 16), format('Size', 12), format('Modify Time', 20));
        if(files.length === 0) 
            console.log(format('----', 4), format('----', 16), format('----', 12), format('----------', 20));
        files.forEach((file) => {
            let stats = fs.statSync(path.join(pathname, file), (err) => { if (err) throw err; });
            let isFile = format(stats.isFile() ? '-f' : '-d', 4);
            let filename = format(file, 16);
            let filesize = format(stats.size.toString(), 12);
            let modifytime = format(stats.mtime.toISOString().slice(0, 19).replace('T', ' '), 20);
            console.log(isFile, filename, filesize, modifytime);
        });
    } else {
        console.log('not a directory:',pathname);
    }
});



emitter.on("dir", (cmds) => {

    if (!cmds[1]) {
        refreshScreen();
        return;
    }

    let pathname = path.normalize(path.join(CURR_PATH, cmds[1]));

    if(!isSubDirOf(pathname,ROOT_DIR) && pathname !== ROOT_DIR){
        refreshScreen('you don\'t have permission to access: '+ pathname);
        return;
    }

    if (fs.existsSync(pathname)) {
        let isDirectory = fs.lstatSync(pathname).isDirectory();
        CURR_PATH = isDirectory ? pathname : path.dirname(pathname);
        refreshScreen();
    } else {
        rl.question('Folder or file does not exist, are you sure to create(Y/N)?', (answer) => {
            if (['Y', 'y'].includes(answer)) {
                if (path.extname(pathname)==='') {
                    fs.mkdir(pathname, {recursive: true}, (err) => {
                        if (err) throw err;
                        refreshScreen('Folder created.');
                    });
                } else {
                    fs.writeFile(pathname, '', (err) => {
                        if (err && err.code === 'ENOENT') {
                            fs.mkdir(path.dirname(pathname), {recursive: true}, (err) => {
                                if (err) throw err;
                                fs.writeFile(pathname, '', (err) => {
                                    if (err) throw err;
                                });
                            });
                        }
                        refreshScreen('File created.');
                    });
                }
            } else {
                refreshScreen('');
            }
            
        });
    }
});

emitter.on("del", (cmds) => {

    if(!cmds[1]) {
        emitter.emit('invalid','Please specify a path to delete.');
        return;
    }
        
    let pathname = path.normalize(path.join(CURR_PATH, cmds[1]));

    if(!isSubDirOf(pathname,ROOT_DIR)){
        refreshScreen('you don\'t have permission to delete: '+ pathname);
        return;
    }

    if(fs.existsSync(pathname)){
        if (path.extname(pathname)==='') {
            fs.rmdir(pathname, (err) => {
                if (err && err.code === 'ENOTEMPTY') {
                    refreshScreen('Directory not empty.');
                } else {
                    if(path.normalize(pathname) === path.normalize(CURR_PATH))
                        CURR_PATH = path.dirname(CURR_PATH);
                    refreshScreen('Folder deleted.');
                }
                 
            });
        }else{
            fs.unlink(pathname, (err) => {
                if(err) throw err;
                refreshScreen('File deleted.');
            });
        }
        
    } else {
        refreshScreen('No such file or directory!');
    }
    
});

emitter.on("rename", (cmds) => {

    //invalid commands
    if(!(cmds[1] && cmds[2])){
        emitter.emit('invalid','Missing [path1] or [path2]');
        return;
    }
    
    let oldPath = path.normalize(path.join(CURR_PATH,cmds[1]));
    let newPath = path.normalize(path.join(CURR_PATH,cmds[2]));

    //file or folder does not exist in current folder
    if(!fs.existsSync(oldPath)){
        refreshScreen('File or folder does not exist in current directory');
        return;
    }

    //newPath accessing outside share folder
    if(!isSubDirOf(newPath, ROOT_DIR) || newPath === ROOT_DIR){
        refreshScreen(`you don\'t have permission to rename "${oldPath}" to "${newPath}"`);
        return;
    }

    //newPath already exist
    if(fs.existsSync(newPath)){
        refreshScreen(newPath + ' already exist');
        return;
    }

    fs.rename(oldPath, newPath, (err) => {
        if(err) throw err;
        CURR_PATH = (path.extname(newPath)==='') ? newPath : path.dirname(newPath);
        refreshScreen('renamed.');
    });
});

emitter.on("quit", () => {
    console.log('bye, bye!');
    process.exit(0);
});

emitter.on("invalid", (msg) => {
    console.log(
`Error: ${msg}
Please refer to the following format:
dir [path]
del [path]
rename [path1] [path2]
quit`);
    prompt(); 
});


/*
 * on start 
 */

if (!fs.existsSync(ROOT_DIR)) {
    fs.mkdirSync(ROOT_DIR);
    console.log('share folder created.');
}

refreshScreen();

rl.on('line', (input) => {
    let cmds = input.split(' ');
    if (!emitter.emit(cmds[0], cmds))
        emitter.emit('invalid','Unknown command: '+cmds[0]);
});