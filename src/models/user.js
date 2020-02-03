const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) { // validator is a npm package
                throw new Error('Must provide an email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(pas) {
            if (~pas.toLowerCase().indexOf('password')) {  // same as (pas.toLowerCAse().indexOf('password') >= 0) (~ like not)`
                throw new Error('Password cannot contain password');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
});

module.exports = User;
