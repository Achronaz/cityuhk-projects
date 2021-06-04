//setup APlayer
const ap = new APlayer({
    container: document.getElementById('aplayer'),
    volume: 0.5,
    listFolded: true,
    audio: [] //audio_sources
});
const playSong = (name, artist, url, cover) => {
    let added = false;
    ap.list.audios.forEach((audio, index) => {
        if (audio.name == name && audio.artist == artist) {
            ap.list.switch(index);
            added = true;
        }
    });
    if (!added) {
        ap.list.add([{
            name: name,
            artist: artist,
            url: url,
            cover: cover
        }]);
        ap.list.switch(ap.list.audios.length - 1);
    }
    ap.play();
}

function escapeHtml(unsafe) {
    return unsafe
        .replace('"', '\\\"')
        .replace("'", "\\\'");
}

function signin() {
    $.ajax({
        type: 'POST',
        data: {
            username: $('#signin_username').val(),
            password: $('#signin_password').val()
        },
        dataType: 'json',
        url: '/api/user/signin',
        success: function (result) {
            if (result.code === 100) {
                window.location.reload();
            } else {
                alert(result.msg);
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function signup() {
    $.ajax({
        type: 'POST',
        data: {
            username: $('#signup_username').val(),
            password: $('#signup_password').val(),
            repeatpassword: $('#signup_repeat_password').val()
        },
        dataType: 'json',
        url: '/api/user/signup',
        success: function (result) {
            if (result.code === 100) {
                alert('signup success.');
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function signout() {
    $.ajax({
        type: 'POST',
        data: {},
        dataType: 'json',
        url: '/api/user/signout',
        success: function (result) {
            if (result.code === 100)
                window.location.href = '/';
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}
//add listener for search button
$('#search_button').on('click', function () {
    var option = $('#search_option').val();
    var key = $('#search_key').val();
    if (key !== '') {
        window.location.href = '/search/' + option + '/' + key;
    }
});

function manage_search_artist() {
    var artistname = $('#form_search_artist_name').val();
    $.ajax({
        type: 'GET',
        data: {
            artistname: artistname
        },
        dataType: 'json',
        url: '/api/manage/search/artist',
        success: function (result) {
            if (result.code === 100) {
                var artists = result.artists;
                var temp = "";
                if (artists.length === 0) {
                    temp += `<a class="list-group-item">'${artistname}' not found.</a>`;
                } else {
                    artists.forEach(function (artist) {
                        temp +=
                            `<a onclick="manage_load_albums('${artist.artistid}')" data-target="#artist_${artist.artistid}_albums" class="list-group-item" data-toggle="collapse">
                            <i class="fas fa-angle-right"></i>${artist.artistname}
                            <button class="btn btn-link btn-sm" onclick="manage_new_album(event,'${artist.artistid}','${artist.artistname}')"><i class="fas fa-plus"></i> New Album</button>
                            <button class="btn btn-link btn-sm" onclick="manage_modify_artist(event,${artist.artistid},'${artist.artistname}','${artist.description}')">Edit</button>
                            <button class="btn btn-link btn-sm" onclick="manage_delete_artist(event,${artist.artistid})">Delete</button>
                        </a>
                        <div class="list-group collapse" id="artist_${artist.artistid}_albums"> loading albums ...</div>`;

                    });
                }
                $('#manage_artist_search_list').html(temp);
                $('.list-group-item').off();
                $('.list-group-item').on('click', function () {
                    $('.fas', this).toggleClass('fa-angle-right').toggleClass('fa-angle-down');
                });
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_modify_artist(event, artistid, artistname, description) {
    event.stopPropagation();
    $('#modal_edit_artist').modal('show');
    $('#edit_artist_for').html(artistname);
    $('#form_edit_artist_desc').val(description);
    $('#form_edit_artist_name').val(artistname);
    $('#form_edit_artist_artistid').val(artistid);
}

function manage_edit_artist(formData) {
    $.ajax({
        type: 'POST',
        data: formData,
        dataType: 'json',
        cache: false,
        processData: false,
        contentType: false,
        url: '/api/manage/edit/artist',
        success: function (result) {
            if (result.code === 100) {
                alert('edit success');
                $('#modal_edit_artist').modal('hide');
            } else {
                alert('something wrong');
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_delete_artist(event, artistid) {
    event.stopPropagation();
    $.ajax({
        type: 'GET',
        data: {
            artistid: artistid
        },
        dataType: 'json',
        url: '/api/manage/delete/artist',
        success: function (result) {
            if (result.code === 100) {
                alert('delete success');
                manage_search_artist()
            } else if (result.code === 1451) {
                alert('artist is referenced.');
            } else {
                alert('something wrong');
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_create_artist(formData) {
    $.ajax({
        type: 'POST',
        data: formData,
        dataType: 'json',
        url: '/api/manage/create/artist',
        cache: false,
        processData: false,
        contentType: false,
        success: function (result) {
            if (result.code === 100) {
                manage_search_artist();
                $('#modal_create_artist').modal('hide');
            } else {
                alert('something wrong');
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_load_albums(artistid) {
    $.ajax({
        type: 'GET',
        data: {
            artistid: artistid
        },
        dataType: 'json',
        url: '/api/manage/get/album',
        success: function (result) {
            if (result.code === 100) {
                var albums = result.albums;
                var temp = '';
                if (albums.length === 0) {
                    temp += `<a class="list-group-item">no album exist.</a>`;
                } else {
                    albums.forEach(function (album) {
                        temp +=
                            `<a onclick="manage_load_songs(${album.albumid})" data-target="#album_${album.albumid}" data-toggle="collapse" class="list-group-item">
                            <i class="fas fa-angle-right"></i>${album.albumtitle}
                            <button class="btn btn-link btn-sm" onclick="manage_new_song(event,'${album.artistid}','${album.artistname}','${album.albumtitle}','${album.albumid}')"><i class="fas fa-plus"></i> New Song</button> 
                            <button class="btn btn-link btn-sm" onclick="manage_modify_album(event,'${album.artistid}','${album.artistname}','${album.albumtitle}','${album.genre}','${album.albumid}')">Edit</button>
                            <button class="btn btn-link btn-sm" onclick="manage_delete_album(event,'${album.albumid}','${album.artistid}')">Delete</button>
                        </a>
                        <div class="list-group collapse " id="album_${album.albumid}">loading songs ...</div>`;

                    });
                }
                $(`#artist_${artistid}_albums`).html(temp);
                $('.list-group-item').off();
                $('.list-group-item').on('click', function () {
                    $('.fas', this).toggleClass('fa-angle-right').toggleClass('fa-angle-down');
                });
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_new_album(event, artistid, artistname) {
    event.stopPropagation();
    $('#modal_create_album').modal('show');
    $('#create_album_for').html(artistname);
    $('#manage_create_album_artistid').val(artistid);
}

function manage_create_album(formData) {
    $.ajax({
        type: 'POST',
        data: formData,
        dataType: 'json',
        url: '/api/manage/create/album',
        cache: false,
        processData: false,
        contentType: false,
        success: function (result) {
            if (result.code !== 100)
                alert('something wrong.');
            $('#modal_create_album').modal('hide');
            manage_load_albums($('#manage_create_album_artistid').val());
            $('#manage_create_album_form')[0].reset();

        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_new_song(event, artistid, artistname, albumtitle, albumid) {
    event.stopPropagation();
    $('#modal_create_song').modal('show');
    $('#create_song_for').html(artistname + ' - ' + albumtitle);
    $('#manage_create_song_artistid').val(artistid);
    $('#manage_create_song_artistname').val(artistname);
    $('#manage_create_song_albumid').val(albumid);
}

function manage_create_song(formData) {
    $.ajax({
        type: 'POST',
        data: formData,
        dataType: 'json',
        url: '/api/manage/create/song',
        cache: false,
        processData: false,
        contentType: false,
        success: function (result) {
            alert(result.code === 100 ? 'create success' : 'something wrong');
            $('#modal_create_song').modal('hide');
            $('#manage_create_song_form')[0].reset();
            manage_load_songs($('#manage_create_song_albumid').val());
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_load_songs(albumid) {
    $.ajax({
        type: 'GET',
        data: {
            albumid: albumid
        },
        dataType: 'json',
        url: '/api/manage/get/song',
        success: function (result) {
            var songs = result.songs;
            var temp = '';
            if (songs.length === 0) {
                temp += `<a class="list-group-item">no song exist.</a>`;
            } else {
                songs.forEach(function (song) {
                    temp +=
                        `<a class="list-group-item">
                        ${song.songtitle}
                        <button class="btn btn-link btn-sm" onclick="playSong('${escapeHtml(song.songtitle)}','${escapeHtml(song.artistname)}','/source/complete/${escapeHtml(song.filepath)}','/source/album_cover/${escapeHtml(song.coverpath)}')">Play</button>
                        <button class="btn btn-link btn-sm" onclick="download('${escapeHtml(song.songtitle)}','${escapeHtml(song.filepath)}')">Download</button>
                        <button class="btn btn-link btn-sm" onclick="manage_modify_song(event,'${song.artistid}','${song.artistname}','${song.albumtitle}','${song.albumid}','${song.songtitle}','${song.price}','${song.songid}')">Edit</button>
                        <button class="btn btn-link btn-sm" onclick="manage_delete_song('${song.songid}','${song.albumid}')">Delete</button>
                    </a>`;
                });
            }
            $(`#album_${albumid}`).html(temp);
            $('.list-group-item').off();
            $('.list-group-item').on('click', function () {
                $('.fas', this).toggleClass('fa-angle-right').toggleClass('fa-angle-down');
            });
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function new_order(name, option, id) {
    $('#create_order_for').html(option + ' "' + name + '".');
    $('#order_option').val(option);
    if (option == 'song') {
        $('#order_songid').val(id);
    } else {
        $('#order_albumid').val(id);
    }
}

function user_create_order(payment_method) {
    let data = {};
    let url = '';
    if($('#order_option').val() == 'song'){
        data = {
            songid: $('#order_songid').val(),
            payment_method: payment_method
        }
        url = '/api/order/song';
    }else{
        data = {
            albumid: $('#order_albumid').val(),
            payment_method: payment_method
        }
        url = '/api/order/album';
    }
    $.ajax({
        type: 'GET',
        data: data,
        dataType: 'json',
        url: url,
        success: function (result) {
            if(result.err === undefined){
                alert(result.msg);
                if (result.code === 100){
                    window.location.reload();
                } else if (result.code === 201) {
                    $('#modal_sign').modal('show');
                }
            }else{
                if(result.err.code == 'ER_DUP_ENTRY')
                    alert('You have already purchased. Please check history!');
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_delete_album(event, albumid, artistid) {
    event.stopPropagation();
    $.ajax({
        type: 'get',
        data: {
            albumid: albumid
        },
        dataType: 'json',
        url: '/api/manage/delete/album',
        success: function (result) {
            if (result.code === 100) {
                manage_load_albums(artistid);
            } else if (result.code = 1451) {
                alert('album is referenced.');
            } else {
                alert(result.msg);
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_modify_album(event, artistid, artistname, albumtitle, genre, albumid) {
    event.stopPropagation();
    $('#modal_edit_album').modal('show');
    $('#form_edit_album_albumtitle').val(albumtitle);
    $('#manage_edit_album_albumid').val(albumid);
    $('#form_edit_album_genre').val(genre);
    $('#edit_album_for').html(artistname + ' - ' + albumtitle);
    $('#manage_edit_album_artistid').val(artistid);
}

function manage_edit_album(formData) {
    $.ajax({
        type: 'POST',
        data: formData,
        dataType: 'json',
        url: '/api/manage/edit/album',
        cache: false,
        processData: false,
        contentType: false,
        success: function (result) {
            alert(result.code === 100 ? 'edit success' : 'something wrong');
            $('#modal_edit_album').modal('hide');
            manage_load_albums($('#manage_edit_album_artistid').val());
            $('#manage_edit_album_form')[0].reset();
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_modify_song(event, artistid, artistname, albumtitle, albumid, songtitle, price, songid) {
    event.stopPropagation();
    $('#modal_edit_song').modal('show');
    $('#edit_song_for').html(artistname + ' - ' + albumtitle + ' - ' + songtitle);
    $('#manage_edit_song_songtitle').val(songtitle);
    $('#manage_edit_song_price').val(price);
    $('#manage_edit_song_artistid').val(artistid);
    $('#manage_edit_song_artistname').val(artistname);
    $('#manage_edit_song_albumid').val(albumid);
    $('#manage_edit_song_songid').val(songid);
}

function manage_edit_song(formData) {
    $.ajax({
        type: 'POST',
        data: formData,
        dataType: 'json',
        url: '/api/manage/edit/song',
        cache: false,
        processData: false,
        contentType: false,
        success: function (result) {
            alert(result.code === 100 ? 'edit success' : 'something wrong');
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function manage_delete_song(songid, albumid) {
    $.ajax({
        type: 'get',
        data: {
            songid: songid
        },
        dataType: 'json',
        url: '/api/manage/delete/song',
        success: function (result) {
            if (result.code === 100) {
                manage_load_songs(albumid);
            } else {
                alert(result.msg);
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function download(name, url) {
    var link = document.createElement('a');
    link.setAttribute('href', '/source/complete/' + url);
    link.setAttribute('download', name);
    link.click();
}

function order_refund(orderid){
    $.ajax({
        type: 'get',
        data: {
            orderid: orderid
        },
        dataType: 'json',
        url: '/api/order/refund',
        success: function (result) {
            if (result.code === 100) {
                alert('Refunded.');
                window.location.reload();
            } else {
                alert(result.msg);
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });  
}
function order_cancel_refund (orderid){
    $.ajax({
        type: 'get',
        data: {
            orderid: orderid
        },
        dataType: 'json',
        url: '/api/order/cancel/refund',
        success: function (result) {
            if (result.code === 100) {
                alert(result.msg);
                window.location.reload();
            } else {
                alert(result.msg);
            }
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });    
}