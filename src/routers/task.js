const express = require('express');
const router = new express.Router();
const Task = require ('../models/task');

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id', async  (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task ? res.send(task) : res.status(400).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/:id', async (req, res) => {
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
    //find task
    const task = await Task.findById(req.params.id)

    if (!task) {
        return res.status(404).send()
    }

    updates.forEach(update => task[update] = req.body[update])
    await task.save()


    res.send(task);

    // //// USE findById instead of findByIdAndUpdate because mongoose bypasses middleware with findByIdAndUpdate

    // const task = await Task.findById(req.params.id);

    // // if no task return 401
    // task ? res.send(task) : res.status(401).send();

    // // loop through updates provided by req.body
    // updates.forEach((update) => {

    //     //update each task field
    //     task[update] = req.body[update];
    // });

    // await task.save();
    // res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/:id', async (req, res) => {

  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)

    deletedTask ? res.send(deletedTask) : res.status(404).send()
  } catch (e) {
    res.status(500).send(e);
  }
})

module.exports = router;
