const express = require('express');

require('./db/mongoose'); // connect to database
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');


const app = express();
const port = process.env.PORT || 3000;




app.use(express.json());
app.use('/tasks', taskRouter);
app.use('/users', userRouter);



app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//   // const task = await Task.findById('5e3c7972fa05c7c2b62739ec');
//   // await task.populate('owner').execPopulate() // using ref in task model populate and execPopulate gets User Document
//   // console.log(task.owner);

//   const user = await User.findById('5e3c78c406cd0cc228f5dabc')
//   await user.populate('tasks').execPopulate()
//   console.log(user.tasks);

// }

// main();
