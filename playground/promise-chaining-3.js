require ('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('5e38055743adef5aa739382c')
    const result = await ((result) => {
        console.log(result);
        return Task.countDocuments({ completed: false })
    })
    const item = await ((item) => {
        console.log(item);
    })
    .catch((e) => console.log(e));


// create deleteTaskAnd Count as async function
const deleteTaskAndcount = async (id, count) => {
  const deleteAcount = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false })
};

deleteTaskAndCount = async (id , )
