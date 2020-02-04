const express = require('express');
const router = new express.Router();
const User = require('../models/user');


router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user ? res.send(user) : res.status(404).send();
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post('/', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/:id', async (req, res) => {
  // what is allowed to update
  const updates = Object.keys(req.body) // returns list of keys from req.body
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    user ? res.send(user) : res.status(401).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/:id', async (req, res) => {

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)

    deletedUser ? res.send(deletedUser) : res.status(404).send()
  } catch (e) {
    res.status(500).send(e);
  }
})


module.exports = router;
