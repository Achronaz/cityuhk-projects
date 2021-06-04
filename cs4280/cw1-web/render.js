const util = require('./util');

const directory = (file) => {
    let temp = '';
    if(file.length === 0) temp = `<tr><td colspan="3">Directory is empty.</td></tr>`;
    file.forEach(f => {
        let icon = f.isFile ? `<span class="icon"><i class="fas fa-file"></i></span>  ` : `<span class="icon"><i class="fas fa-folder"></i></i></span>  `;
        temp += `<tr>         
                    <td>
                        <div class="field has-addons">
                            <p><a class="button is-white" onclick="readFile('/${f.href}',${f.isFile})"><span class="icon">${icon}</span></a></p>
                            <p><input class="input" type="text" placeholder="file name" value="${f.name}" id="newpath_${f.href}"></p>
                            <p><a class="button is-white" onclick="handleRename('${f.href}')"><span class="icon"><i class="fas fa-edit"></i></span><span>rename</span></a></p>
                            <p><a ${f.isFile ? `href="${f.href}&o=download"` : 'disabled'} class="button is-white"><span class="icon"><i class="fas fa-download"></i></span><span>download</span></a></p>
                            <p><a class="button is-white" href="/delete?filepath=${f.href}"><span class="icon"><i class="fas fa-trash"></i></span><span>delete</span></a></p>
                        </div>
                    </td>
                    <td>${f.size} b</td>
                    <td>${f.mtime}</td>
                </tr>`;
    });
    return temp;
}
const breadcrumb = (p) => {
    
    let dir = util.splitPath(p);
    let href = '';
    let temp = ``;
    for(let i = 0; i < dir.length - 1; i++) {
        href += href === '' ? `${dir[i]}` : `/${dir[i]}`;
        temp += `<li><a href="/${href}">${dir[i]}</a></li>`;
    }
    temp += `<li class="is-active"><a href="#">${dir[dir.length - 1]}</a></li>`;

    return temp;
}


//params: f for file, p for path
const template = (files, currdir, msg, isErr) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>File Explorer</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css">
    <script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</head>
<body>
    <div class="container">
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <a href="/share" >
                <div class="navbar-brand">
                    <div class="navbar-item"><div class="content is-large">File Explorer</div></div>
                </div>
            </a>
        </nav>
        <div class="columns">
            <div class="column is-12">
                <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
                    <ul>` + breadcrumb(currdir) + `</ul>
                </nav>
                <div class="card">
                    <table class="table  is-fullwidth">
                        <thead>
                            <tr>
                                <th>File</th>
                                <th>Size</th>
                                <th>Last Modified</th>
                            </tr>
                        </thead>` 
                        + directory(files) +
                        `<tr>
                            <td colspan="3">
                                <div class="field has-addons">
                                    <p>
                                        <a id="new_button" class="button is-white" onclick="handleNew()">
                                            <span class="icon"><i class="fas fa-plus"></i></span>
                                            <span>New</span>
                                        </a>
                                    </p>
                                    <p><input class="input" type="text" placeholder="file or folder" id="newfilename"></p>
                                    <p>
                                        <a id="upload_button" class="button is-white" onclick="handleUpload()">
                                            <span class="icon"><i class="fas fa-upload"></i></span>
                                            <span>Upload</span>
                                        </a>
                                    </p>
                                    
                                </div>
                            </td>
                        </tr>
                    </table> 
                </div>
            </div>
        </div>
        <form id="uploadform" method="post" enctype="multipart/form-data" action="/upload" style="display:none">
            <input id="currentdirectory" type="text" name="dir" value="${util.splitPath(currdir).join('/')}">
            <input id="uploader" type="file" name="file" class="file-input">
        </form>
        <div class="notification is-danger" style="display:none">
            <button class="delete"></button>
            <span id="msgBox">...</span>
        </div>
    </div>
    <script src="/src/js/script.js"></script>
    <script>
        var msg = '${msg}';
        var $msgBox = document.getElementById('msgBox');
        var $notification = $msgBox.parentNode;
        function showMsg(message, isErr){
            $notification.classList.add(isErr ? 'is-danger' : 'is-success');
            $msgBox.innerHTML = message;
            $notification.setAttribute('style','display:block');
        }
        function dismissMsg(){
            $notification.setAttribute('style','display:none');
        }
        if(msg === ''){
            dismissMsg();
        } else {
            showMsg(msg, ${isErr});
        }
    </script>
</body>
</html>`;

module.exports = { 
    template:template
};