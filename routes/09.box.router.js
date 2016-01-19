module.exports = function (server) {
    var express = require('express'),
        router = express.Router(),
        io = require('socket.io')(server),
        Log = require('log'),
        fs = require('fs'),
        log = new Log('debug', fs.createWriteStream('./log/09.box.log', { flags: 'a' })),
        stat = { online: 0 },
        Shout;
    
    initDB();
    initIO();
    initRouter();
    return router;
    
    function refreshStat() {
        stat.online = io.engine.clientsCount;
        io.emit('stat', stat);
        log.info('Now %s online.', stat.online);
    }
    
    // cb: function (err, shouts)
    function getLatestShouts(cb) {
        if (Shout) {
            Shout.find({}, '_id author ip body idColor')
                .sort('-_id')//sort by _id reversely
                .limit(40)
                // .lean()
                .exec(cb);
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
            log.info('A user connected.');
            
            refreshStat();
            
            getLatestShouts(function (err, shouts) {
                socket.emit('connection', err ? [] : shouts);
                log.info('%s shouts transmitted.', shouts.length);
            });
            
            socket.on('disconnect', function () {
                log.info('A user disconnected.');
                refreshStat();
            });
            
            socket.on('shout', function (shout) {
                log.info('A shout received.');
                var shoutInstance = new Shout({
                    author: shout.author,
                    body: shout.body,
                    ip: socket.conn.remoteAddress
                });
                shoutInstance.save(function (err, savedShout) {
                    if (err) {
                        log.error('Error saving shout: ' +
                            JSON.stringify(shout) +
                            '\nmessage: ' +
                            err.message);
                    } else {
                        var retShout = {
                            _id: savedShout._id,
                            author: savedShout.author,
                            body: savedShout.body,
                            idColor: savedShout.idColor
                        };
                        io.emit('shout', retShout);      
                        log.info('Shout broadcasted');
                    }
                })
            });
        });
    }
};