const mongoose = require('mongoose');


// create task schema
    // Mongoose renames model tasks in database

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})


module.exports = Task;
