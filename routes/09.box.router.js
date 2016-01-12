module.exports = function (server) {
    var express = require('express'),
        router = express.Router(),
        io = require('socket.io')(server),
        uuid = require('uuid'),
        stat = { online: 0 };
    
    router.get('/', function (req, res) {
        res.render('09.box.jade');
    });
    
    function refreshStat() {
        stat.online = io.engine.clientsCount;
        io.emit('stat', stat);
    }
    
    io.on('connection', function (socket) {
        refreshStat();
        socket.emit('connection', [
            {
                author: "Israfel",
                id: "I001",
                body: " a shout from server"
            }, {
                author: "madao",
                id: "M001",
                body: " another shout from server"
            }
        ]);
        
        socket.on('disconnect', function () {
            refreshStat();
        });
        
        socket.on('shout', function (shout) {
            console.log('received shout:', shout);
            shout.id = uuid.v4();
            //todo: save it in db
            console.log('broadcasting shout:', shout);
            io.emit('shout', shout);
        });
        setTimeout(function() {
            socket.emit('shout', {
                author: "bzfdu",
                id: "B001",
                body: " what's up"
            });
        }, 1000);
    });
    
    return router;
};