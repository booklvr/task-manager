const mongoose = require('mongoose');


// create task schema
    // Mongoose renames model tasks in database
const taskSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});


const Task = mongoose.model('Task', taskSchema);



module.exports = Task;
