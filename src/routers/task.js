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
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    task ? res.send(task) : res.status(401).send();
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
