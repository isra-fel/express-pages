var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    CRC32 = require('crc-32');

var ShoutSchema = new Schema({
    author: {
        type: String,
        trim: true,
        required: true,
        validate: [
            function (author) {
                return author.length <= 12;
            },
            'Shout author should contain less than 12 characters'
        ]
    },
    body: {
        type: String,
        trim: true,
        required: true,
        validate: [
            function (body) {
                return body.length <= 140;
            },
            'Shout body should contain less than 140 characters'
        ]
    },
    ip: {
        type: String,
        trim: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

ShoutSchema.virtual('idColor').get(function () {
    return _randomColor(this.author, this.ip);
});

ShoutSchema.set('toJSON', { getters: true, virtuals: true });
ShoutSchema.set('toObject', { getters: true, virtuals: true });

Mongoose.model('Shout', ShoutSchema);

function _randomColor(author, ip) {
    var h = (CRC32.str(author + ' ' + ip) % 180 + 180) / 360,
        rgb = _HSVtoRGB(h, 0.6, 1);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

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