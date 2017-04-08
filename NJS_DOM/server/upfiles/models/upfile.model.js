/**
 * Created by LICA4 on 11/15/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UpfileSchema = new Schema({

    createUser: {
        type: String
    },

    created: {
        type: Date, default: Date.now
    },

    name: {
        type: String, default: ''
    },

    fileSrc: {
        type: String, default: ''
    },

    fileThumbSrc: {
        type: String, default: ''
    },

    isDelete: {
        type: Boolean, default: false
    }
});

exports.UpfileModel = mongoose.model('Upfile', UpfileSchema);
