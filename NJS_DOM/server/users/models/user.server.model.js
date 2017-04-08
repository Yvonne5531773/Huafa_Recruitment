/**
 * Created by HUGO on 6/30/2016.
 */
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
    //generatePassword = require('generate-password');
    //owasp = require('owasp-password-strength-test');

var LoginuserSchema = new Schema({
    userid: {
        type: String, lowercase: true, required:true
    },
    password:{
        type: String
    },
    salt: {
        type: String
    },
    role: {
        type: String, required:true
    },
    accountType: {
        type: String
    },
    created: {
        type: Date, default: Date.now
    },
    createdBy: {
        type: String, default: 'admin'
    },
    updated: {
        type: Date, default: Date.now
    },
    updatedBy: {
        type: String, default: 'admin'
    },
    company: {
        type: String
    }
});

/**
 * Hook a pre save method to hash the password
 */
LoginuserSchema.pre('save', function (next) {
    console.log('pre saing.....');
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 * Hook a pre update method to hash the password
 */
LoginuserSchema.pre('update', function (next) {
    console.log('pre updating.....');
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
        console.log('pre updating password', this.password);
    }
    next();
});

/**
 * Create instance method for hashing a password
 */
LoginuserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

LoginuserSchema.statics.hashPassword = function (loginuser) {
    if(loginuser.salt){
        loginuser.salt = crypto.randomBytes(16).toString('base64');
    }
    if (loginuser.password) {
        return crypto.pbkdf2Sync(loginuser.password, new Buffer(loginuser.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return loginuser.password;
    }
};
/**
 * Create instance method for authenticating user
 */
LoginuserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};
/**
 * Find possible not used username
 */
LoginuserSchema.statics.findUniqueUsername = function (userid, suffix, callback) {
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

mongoose.model('Loginuser', LoginuserSchema);
