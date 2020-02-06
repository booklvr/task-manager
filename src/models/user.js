const mongoose = require('mongoose');
const validator = require('validator');  // validate email
const bcrypt = require('bcryptjs');  // hash passwords
const jwt = require('jsonwebtoken');
const Task = require('./task');  // required for delete all tasks middleware

// Create User Schema
// * name
// * email
// * password
// * age
// * tokens (from jsonwebtoken)
// * timestamps (as second object provided to user Schema)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
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
    tokens: [{  // from jsonwebToken
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

//Only send back public data
// * no arrow function for "this"
// * .toJSON every time json data is sent back it removes user.password and user.tokens
userSchema.methods.toJSON = function () {
    const user = this;

    const userObject = user.toObject() // toObject == mongoose method

    // delete operator removes property from object
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

// Create virtual connection to all Tasks created by User
// * User local field and Task foreign Field must match
userSchema.virtual('tasks', {
    ref: 'Task',  // reference Task Model,
    localField: '_id',  // local property that is same as foriegn field (user _id)
    foreignField: 'owner' // name of thing on Task model that creates relationship (user_id)
})

//create userToken
userSchema.methods.generateAuthToken = async function () {  // not arrow function to use this
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;

    // res.send({ user, token })

    // add new tokens to user in case signed in on multiple devices.
    // user.tokens = user.tokens.concat({ token });
    // await user.save() // save new token to database

    return token;
}

// LOGIN
// validate user by email and password for login
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {  // not arrow function because of this
    const user = this // easier to see than this

    // check if password is modified
    if (user.isModified('password')) {

        //hash password before save
        user.password = await bcrypt.hash(user.password, 8);
    }

    next()
})

// Delete user tasks when user is removed
// * can't use arrow function because of 'this'
userSchema.pre('remove', async function (next) {
    const user = this  // change this to user for clarity

    // delete all tasks whose ownder is user_.id (logged in user)
    await Task.deleteMany({ owner: user._id})

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;
