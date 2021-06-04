const path = require('path');
const env = {
    ROOT: path.normalize(path.join(__dirname, '')),
    SHARE_ROOT: path.normalize(path.join(__dirname, 'share')),
    TEMP_ROOT: path.normalize(path.join(__dirname, 'tempfile'))
}
const splitPath = (p) => p.split(/[\\\/]/ig).filter((el) => el.length != 0);
const getDirName = (p) => splitPath(p).slice(0,-1).join('/') + '/';
const isSubDirOf = (child, parent) => {
    if (child === parent) return false;
    let parentTokens = parent.split(path.sep).filter(i => i.length);
    return parentTokens.every((t, i) => child.split(path.sep)[i] === t);
}

module.exports = {
    env: env,
    splitPath: splitPath,
    getDirName: getDirName,
    isSubDirOf: isSubDirOf
}
