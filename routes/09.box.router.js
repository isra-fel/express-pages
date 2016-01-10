module.exports = function (server) {
    var express = require('express'),
        router = express.Router(),
        io = require('socket.io')(server);
    
    router.get('/', function (req, res) {
        res.render('09.box.jade');
    });
    
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('a user disconnected');
        });
        socket.on('private message', function (from, msg) {
            console.log('I received a private message by ', from, ' saying ', msg);
        });
    });
    
    return router;
};