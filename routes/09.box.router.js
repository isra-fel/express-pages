module.exports = function (server) {
    var express = require('express'),
        router = express.Router(),
        io = require('socket.io')(server),
        Log = require('log'),
        fs = require('fs'),
        log = new Log('debug', fs.createWriteStream('./log/09.box.log', { flags: 'a' })),
        stat = { online: 0 },
        CRC32 = require('crc-32'),
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
    
    /**
     * Gets the latest 40 shouts.
     * @return {Promise} Promise that resolves to shouts
     */
    function getLatestShoutsPromise() {
        return Shout.find({}, '_id author body idColor')
            .sort('-_id')//sort by _id reversely
            .limit(40)
            .lean()
            .exec();
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
    
    function _generateColor(author, ip) {
        function _HSVtoRGB(h, s, v) {
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }
        var h = (CRC32.str(author + ' ' + ip) % 180 + 180) / 360,
            rgb = _HSVtoRGB(h, 0.6, 1);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    function initIO() {
        io.on('connection', function (socket) {
            log.info('A user connected.');
            
            refreshStat();
            
            getLatestShoutsPromise().then(function (shouts) {
                socket.emit('connection', shouts);
                log.info('%s shouts transmitted.', shouts.length);
            }, function (err) {
                socket.emit('connection', []);
                log.error('0 shouts transmitted. Error: %s', err.toString());
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
                    ip: socket.conn.remoteAddress,
                    idColor: _generateColor(shout.author, socket.conn.remoteAddress)
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