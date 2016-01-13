var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

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

Mongoose.model('Shout', ShoutSchema);