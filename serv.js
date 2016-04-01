var express = require('express'),
	app = express(),
    server = require('http').Server(app),
	morgan = require('morgan');

/* view engine */
app.set('views', 'views/');
app.set('view engine', 'jade');

/* logger */
app.use(morgan('dev'));

/* static */
app.use(express.static(__dirname));

/* index */
app.use('/', require('./routes/index.router'));
console.log('index started');

/* apps */
app.use('/characteristics', require('./routes/06.characteristics.router'));
console.log('Characteristics started');

app.use('/senritu', require('./routes/07.senritu.router'));
console.log('Senritu started');

app.use('/heart', require('./routes/08.heart.router'));
console.log('Heart started');

app.use('/box', require('./routes/09.box.router')(server));
console.log('Box started');

/* 404 */
app.use(function (req, res) {
	res.status(404);
	res.render('404');
});

server.listen(880, function() {
	console.log('Server started @ port 880');
});
