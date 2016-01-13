module.exports = function (server) {
    var express = require('express'),
        router = express.Router(),
        io = require('socket.io')(server),
        uuid = require('uuid'),
        stat = { online: 0 },
        Shout;
    
    initDB();
    initIO();
    initRouter();
    return router;
    
    function refreshStat() {
        stat.online = io.engine.clientsCount;
        io.emit('stat', stat);
    }
    
    // cb: function (err, shouts)
    function getLatestShouts(cb) {
        if (Shout) {
            Shout.find({}, '_id author body', {
                limit: 40
            }, cb);
        } else {
            console.error('No Shout schema');
            cb(null, []);
        }
    }
    
    
    function initDB() {
        var mongoose = require('mongoose');
        mongoose.connect('mongodb://localhost/shout');
        require('../models/09.box.model.js');
        Shout = mongoose.model('Shout');
    }
    
    function initRouter() {
        router.get('/', function (req, res) {
            res.render('09.box.jade');
        });
    }
    
    function initIO() {
        io.on('connection', function (socket) {
            refreshStat();
            
            getLatestShouts(function (err, shouts) {
                socket.emit('connection', err ? [] : shouts);
            });
            
            socket.on('disconnect', function () {
                refreshStat();
            });
            
            socket.on('shout', function (shout) {
                // console.log('received shout:', shout);
                var shoutInstance = new Shout({
                    author: shout.author,
                    body: shout.body,
                    ip: socket.conn.remoteAddress
                });
                shoutInstance.save(function (err) {
                    if (err) {
                        console.error('Error saving shout: ' +
                            JSON.stringify(shout));
                    } else {
                        shout.id = uuid.v4();
                        // console.log('broadcasting shout:', shout);
                        io.emit('shout', shout);      
                    }
                })
            });
        });
    }
};