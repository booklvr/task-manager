const express = require('express');

require('./db/mongoose'); // connect to database
const User = require('./models/user');  // connect to user model
const Task = require('./models/task');  // connect to task model


const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

app.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      // if (!user) {
      //   return res.status(404).send()
      // }
      // res.send(user)
      user ? res.send(user) : res.status(404).send();

    })
    .catch((e) => {
      res.status(500).send(e)
    });
})

app.post('/users', (req, res) => {
  const user = new User(req.body)

  user.save().then(() => {
    res.send(user)
  }).catch((e) => {
    res.status(400).send(e); // chain together res methods
  });
});

app.get('/tasks', (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

app.get('/tasks/:id', (req, res) => {
  Task.findById(req.params.id)
    .then((task) => {
      task ? res.send(task) : res.status(400).send();
    })
    .catch((e) => {
      res.status(500).send(e)
    });
})

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task.save().then(() => {
    res.status(201).send(task);  // 201 - task created successfully
  }).catch((e) => {
    res.status(400).send(e);
  })
})
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
})
