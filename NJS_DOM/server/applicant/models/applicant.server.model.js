/**
 * Created by HUGO on 6/30/2016.
 */
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');


var ApplicantSchema = new Schema({

    username: {
        type: String, lowercase: true, required:true
    },
    password:{
        type: String
    },
    salt: {
        type: String
    },
    accountType: {
        type: String
    },
    created: {
        type: Date, default: Date.now
    },
    updated: {
        type: Date, default: Date.now
    },
    resume: {
        type: Schema.Types.ObjectId, ref: 'Resume'
    },
    collected: [{
        position: {type: Schema.Types.ObjectId, ref: 'Position'},
        time: {type: Date}
    }],
    applied: [{
        position: {type: Schema.Types.ObjectId, ref: 'Position'},
        time: {type: Date}
    }],
    viewed: {
        type: Date, default: Date.now
    },
    accepted: {
        type: Date, default: Date.now
    }
});

/**
 * Hook a pre save method to hash the password
 */
ApplicantSchema.pre('save', function (next) {
    console.log('pre saing.....');
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 * Create instance method for hashing a password
 */
ApplicantSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

ApplicantSchema.statics.hashPassword = function (loginuser) {
    console.log('hashPassword loginuser.salt1',loginuser.salt)
    if(loginuser.salt){
        loginuser.salt = crypto.randomBytes(16).toString('base64');
    }
    if (loginuser.password) {
        console.log('hashPassword loginuser.salt',loginuser.salt)
        return crypto.pbkdf2Sync(loginuser.password, new Buffer(loginuser.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return loginuser.password;
    }
};
/**
 * Create instance method for authenticating user
 */
ApplicantSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};
/**
 * Find possible not used username
 */
ApplicantSchema.statics.findUniqueUsername = function (userid, suffix, callback) {
    var _this = this;
    var possibleUsername = username.toLowerCase() + (suffix || '');

    _this.findOne({
        userid: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(userid, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

mongoose.model('Applicant', ApplicantSchema);
