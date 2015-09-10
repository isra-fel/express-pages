var express = require('express'),
	app = express(),
	morgan = require('morgan');

/* view engine */
app.set('views', 'views/');
app.set('view engine', 'jade');

/* logger */
app.use(morgan('dev'));

/* static */
app.use(express.static(__dirname));

/* index */
app.use('/', require('./index.router'));
console.log('index started');

/* apps */
app.use('/characteristics', require('./06.characteristics.router'));
console.log('Characteristics started');

app.use('/senritu', require('./07.senritu.router'));
console.log('Senritu started');

/* 404 */
app.use(function (req, res) {
	res.status(404);
	res.render('404');
});

app.listen(80, function() {
	console.log('Server started @ port 80');
});
