$(document).ready(function(){
    var socket = io.connect();

    $('form#send-message').submit(function(e){
        const msg = $(this).find("input").val().trim();
        $(this).find("input").val(null);

        socket.emit('message', msg);

        e.preventDefault();
    });

    socket.on('message', function(msg){
        var obj = JSON.parse(msg);
        msg = "<strong>[" + obj.username + "]</strong> " + obj.msg;
        $('#messages-list ul').append($('<li>').html(msg));
    });

    socket.on('newUser', function(msg){
        var obj = JSON.parse(msg);
        updateOnlineUsers(obj.clients);
    });

    socket.on('outUser', function(msg){
        var obj = JSON.parse(msg);
        updateOnlineUsers(obj.clients)
    });

});

function updateOnlineUsers(data){
    $("#online-users ul").html(null);
    for(var i = 0; i < data.length; i++){
        $('#online-users ul').append($('<li>').html(data[i]));
    }
}

