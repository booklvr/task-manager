const express = require('express');

require('./db/mongoose'); // connect to database
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');


const app = express();
const port = process.env.PORT;


const multer = require('multer');  // allow user to upload files

app.use(express.json());
app.use('/tasks', taskRouter);
app.use('/users', userRouter);


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

