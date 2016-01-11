module.exports = function (server) {
    var express = require('express'),
        router = express.Router(),
        io = require('socket.io')(server);
    
    router.get('/', function (req, res) {
        res.render('09.box.jade');
    });
    
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.emit('connection', [
            {
                author: "Israfel",
                id: "I001",
                content: " a shout from server"
            }, {
                author: "madao",
                id: "M001",
                content: " another shout from server"
            }
        ]);
        socket.on('disconnect', function () {
            console.log('a user disconnected');
        });
        socket.on('private message', function (msg) {
            console.log('I received a private message saying ', msg);
        });
        setTimeout(function() {
            socket.emit('shout', {
                    author: "bzfdu",
                    id: "B001",
                    content: " what's up"
                });
            // setTimeout(function() {
            //     socket.emit('connection', [
            //         {
            //             author: "Israfel",
            //             id: "I001",
            //             content: " XD"
            //         }, {
            //             author: "madao",
            //             id: "M001",
            //             content: " XD"
            //         }
            //     ]);
            // }, 1000);
        }, 1000);
    });
    
    return router;
};