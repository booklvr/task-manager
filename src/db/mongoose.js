const mongoose = require('mongoose');
const validator = require('validator'); // useful library for validation

mongoose.connect('mongodb://127.0.0.1:27017/task-manager', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});




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

const me = new User({
    name: 'Nick',
    email: 'nick.a.dewaal@gmail.com',
    password: 'carcarcar',
    age: 31
});

me.save()
    .then(me => console.log(me))
    .catch(err => console.log(err));



// create task schema
    // Mongoose renames model tasks in database
const Task = mongoose.model('Task', {
    description: {
        type: String,
        reqired: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const task1 = new Task({
    name: 'run fast',
    description: 'there is a bear',
    completed: false
}).save()
    .then(task => console.log(task))
    .catch(err => console.log(err));
