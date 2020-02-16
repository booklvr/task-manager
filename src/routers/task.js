const express = require('express');
const router = new express.Router();
const Task = require ('../models/task');
// const User = require ('../models/user');
const auth = require ('../middleware/auth');



// READ all tasks from logged in User
// * /tasks?completed=true
//    -> search by complete true or false
// * /tasks?limit=10&skip=10;
//    -> limit search by ten and skip first 10
// * /tasks?sortBy=createdAt:desc
//    -> sort by createdAt by descending order

// * get user from auth middleware -> req.user
// * populate tasks from logged in user --> req.user.populate()
//      --> get from use UserSchema.virtual
// * send populated tasks
router.get('/', auth, async (req, res) => {

  const match = {};
  const sort = {}; // empty object to parse sort query

  if (req.query.completed) { //req.query.completed is from http://...tasks?completed=true
    match.completed = req.query.completed === 'true';  // if req.query.complete equals the string 'true' -> match.completed = true
  }

  if (req.query.sortBy) {
    // split sortBy query into parts
    const parts = req.query.sortBy.split(':') // split by chosen special character :
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;  // sort first part = asc or desc
  }

  try {
    await req.user.populate({
      path: 'tasks', // populate tasks
      match, // es6 shorthand match: match
      options: {
        limit: parseInt(req.query.limit), // limit tasks read by ?limit=""
        skip: parseInt(req.query.skip), // skip number of tasks
        sort // es6 shorthand sort: sort
      }
    }).execPopulate();

    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Read Single Task by Id
// * req.params.id === task id
// * req.user._id === user id that created task  --> from auth route
router.get('/:id', auth, async  (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});

    task ? res.send(task) : res.status(404).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/', auth, async (req, res) => {
  // const task = new Task(req.body);

  const task = new Task({
    ...req.body,// spread operator copies everything from req.body
    owner: req.user._id // from auth middleware
  })

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update task from logged in User
// * check if update property in req.body is allowed
// * get user from auth middleware --> req.user
// * find Task using task id --> req.params.id
//                   user id --> req.user._id
router.patch('/:id', auth, async (req, res) => {
  // what is allowed to update
  const updates = Object.keys(req.body); // returns list of keys from req.body
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

    if (!task) {
        return res.status(404).send()
    }

    updates.forEach(update => task[update] = req.body[update])
    await task.save()


    res.send(task);

  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete task from logged in user
// * get task id  -> req.params.id
// * get user id --> req.user._id  (auth middleware)
// * if task is found, delete, send deleted task
router.delete('/:id', auth, async (req, res) => {

  try {
    // const deletedTask = await Task.findByIdAndDelete(req.params.id)
    const deleteTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    deleteTask ? res.send(deleteTask) : res.status(404).send()
  } catch (e) {
    res.status(500).send(e);
  }
})

module.exports = router;
