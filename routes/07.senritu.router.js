var express = require('express'),
	router = express.Router();

router.get('/', function (req, res) {
	res.render('07.senritu.jade');
});

module.exports = router;