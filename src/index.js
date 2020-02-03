const express = require('express');

require('./db/mongoose'); // connect to database
const User = require('./models/user');  // connect to user model
const Task = require('./models/task');  // connect to task model


const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

app.post('/users', (req, res) => {
  const user = new User(req.body)

  user.save().then(() => {
    res.send(user)
  }).catch((e) => {
    res.status(400).send(e); // chain together res methods
  });
});

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task.save().then(() => {
    res.send(task);
  }).catch((e) => {
    res.status(400).send(e);
  })
})
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
})
