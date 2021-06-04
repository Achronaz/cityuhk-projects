function pathToArray(path) {
    return path.split(/[\\\/]/ig).filter(function (el) {
        return el.length != 0
    });
}

function dirname(path) {
    return pathToArray(path).slice(0, -1).join('/') + '/';
}

function handleRename(path) {
    var oldpath = path;
    var newpath = dirname(path) + document.getElementById('newpath_' + path).value;
    window.location.href = window.location.origin + '/rename?oldpath=' + oldpath + '&newpath=' + newpath;
}

function handleNew() {
    var parentDirectory = document.getElementById('currentdirectory').value;
    var newfilename = document.getElementById('newfilename').value;
    if (newfilename === '')
        alert('please enter a name for the file or folder.');
    else
        window.location.href = window.location.origin + '/new?filepath=' + parentDirectory + '/' + newfilename;
}

function handleUpload(event) {
    document.getElementById('uploader').click();
}

function readFile(href, isFile) {
    if (isFile)
        window.open(href);
    else
        window.location.href = window.location.origin + href;
}

document.getElementById('uploadform').addEventListener('change', function (event) {
    document.getElementById('upload_button').classList.add("is-loading");
    this.submit();
}, false);

document.addEventListener('DOMContentLoaded', () => {
    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
        $notification = $delete.parentNode;
        $delete.addEventListener('click', () => {
            $notification.parentNode.removeChild($notification);
        });
    });
});

document.getElementById('newfilename').addEventListener('keyup',(event)=>{
    if (event.keyCode == 13) handleNew();
});

//remove query string of url
window.history.replaceState(null,null,window.location.href.split('?')[0]);