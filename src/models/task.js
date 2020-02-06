const mongoose = require('mongoose');


// create task schema
    // Mongoose renames model tasks in database
const taskSchema

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,  // from user Schema logged in user
        required: true,
        ref: 'User'  // connect to User model
    }
})


module.exports = Task;
