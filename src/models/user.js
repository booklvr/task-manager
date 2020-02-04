const mongoose = require('mongoose');
const validator = require('validator');  // validate email
const bcrypt = require('bcryptjs');  // hash passwords

const userSchema = new mongoose.Schema({
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
    }
})

userSchema.pre('save', async function (next) {  // not arrow function because of this
    const user = this // easier to see than this

    // check if password is modified
    if (user.isModified('password')) {

        //hash password before save
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;
