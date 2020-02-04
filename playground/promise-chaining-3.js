require ('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5e38055743adef5aa739382c')
//     const result = await ((result) => {
//         console.log(result);
//         return Task.countDocuments({ completed: false })
//     })
//     const item = await ((item) => {
//         console.log(item);
//     })
//     .catch((e) => console.log(e));


// create deleteTaskAnd Count as async function
const deleteTaskAndCount = async (id) => {
  const deleteAcount = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false })
  return {deleteAcount, count};
};

deleteTaskAndCount('5e393c7f7a3452704dd359d2')
  .then(count => console.log(count))
  .catch(e => console.log(e));
