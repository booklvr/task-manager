require ('../src/db/mongoose')
const User = require('../src/models/user');

// 5e37f72ade6fc25422b8d29f

// User.findByIdAndUpdate('5e37f66049c19b53c2059ca8', {age: 1})
//     .then((user) => {
//         console.log(user)
//         return User.countDocuments({age: 1})
//     })
//     .then((result) => console.log(result))
//     .catch((e) => console.log(e));

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, {age});
  const count = await User.countDocuments({ age })
  return count
}

updateAgeAndCount('5e39192dd2613414247cafdf', 31)
  .then(count => console.log(count))
  .catch(e => console.log(e));
