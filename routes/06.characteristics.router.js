var express = require('express'),
	CRC32 = require('crc-32'),
	Data = require('../data/06.characteristics.data'),
	tags = Data.tags,
	config = Data.config,
	router = express.Router(),
	logger = require('graceful-logger');
	
/* dynamic */
router.get('/', function (req, res) {
	res.render('06.characteristics.jade');
});

/* service */
router.get('/getData/:name', function(req, res, next) {
	res.status(200);
	res.json(getNewRadarData(req.params.name));
	res.end();
});

module.exports = router;

/* utility functions */
function getNewRadarData(name) {
	var crc = CRC32.str(name);
	return {
		labels : getTags(crc),
		datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : getData(crc)
			}
		]
	};
}

function getTags(crc) {
	logger.info('crc =', crc);
	var tmpTags = tags.slice(),
		left = config.typesNum,
		selected = [];
	if (crc < 0) crc = -crc;
	while (left) {
		selected.push(tmpTags.splice(crc % tmpTags.length, 1)[0]);
		crc = Math.floor(crc / (tmpTags.length + 1));
		--left;
	}
	logger.info(selected);
	return selected;
}

function getData(crc) {
	var p1 = config.prime1,
		p2 = config.prime2,
		left = config.typesNum,
		data = [];
	if (crc < 0) crc = -crc;
	while (left) {
		data.push(crc % config.maxNum);
		crc = crc * p1 + p2;
		--left;
	}
	return data;
}