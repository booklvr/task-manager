require ('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('5e38055743adef5aa739382c')
    .then((result) => {
        console.log(result);
        return Task.countDocuments({ completed: false })
    })
    .then((result) => {
        console.log(result);
    })
    .catch((e) => console.log(e));
