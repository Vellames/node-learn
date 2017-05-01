const KEY = "KEY", SECRET = "SECRET";

// Loading modules
var bodyParser = require("body-parser");
var express = require("express");
var expressLoad = require("express-load");
var session = require("express-session");
var cookieParser = require("cookie-parser");

//
var store = new session.MemoryStore();
var cookie = cookieParser(SECRET);

// Init express and Socket.IO
var app = express();
var io = require('socket.io').listen(app.listen(3000));

// Config jade
app.set("views", "views");
app.set("view engine", "jade");
app.set("view options", {layout: false});

// Static files
app.use(express.static(__dirname +  "/public"));

// Using body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Config session
app.use(cookieParser());
app.use(session({
    secret: SECRET,
    name: KEY,
    resave: true,
    saveUninitialized: true,
    store: store
}));

// Config loads
expressLoad("models").
then("controllers").
then("routes").
into(app);

io.use(function(socket, next){
    var data = socket.request;
    cookie(data, {}, function (err) {
        var sessionId = data.signedCookies[KEY];
        store.get(sessionId, function(err, session){
           if(err || !session || session.username == undefined){
               return next(new Error('acesso negado'));
           } else {
               socket.handshake.session = session;
               return next();
           }
        });
    })
});

var clients = [];
io.on('connection', function(socket){

    var session = socket.handshake.session;

    console.log('The user ' + session.username + " is on!");

    if(session.username != undefined){
        clients.push(session.username);
        var obj = {
            newUser: session.username,
            clients: clients
        };
        io.emit("newUser", JSON.stringify(obj));
    }

    socket.on('disconnect', function(){
        clients.splice(clients.indexOf(session.username), 1);
        var obj = {
            outUser: session.username,
            clients: clients
        };
        io.emit("outUser", JSON.stringify(obj));
    });

    socket.on('message', function(msg){
        var obj = {
            username: session.username,
            date: new Date(),
            msg: msg
        };
        io.emit('message', JSON.stringify(obj));
    });
});

// Start the app
/*app.listen(3000, function(){
   console.log("App running in port 3000")
})*/;