const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');

const router = new express.Router();


router.get('/me', auth, async (req, res) => {

  // get user from auth middleware
  res.send(req.user)
});

// unnecessary route
router.get('/:id', async (req, res) => {
  res.send("no access to other users")
});

router.post('/', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// login user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password); //findByCredentails => userSchema.static function

    // create user jsonwetoken for user from /models/user.js
    const token = await user.generateAuthToken();

    // only send back public information from userSchema.methods.toJSON()
    // send back token for session
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
})


// Logout user
router.post('/logout', auth, async (req, res) => {
  try {
    // remove current session token
    // * filter tokens array by removing current token out of tokens array
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch(e) {
    res.status(500).send();
  }
})

router.post('/logoutAll', auth, async (req, res) => {
  // remove all user session tokens
  // * replace user tokens array with empty array
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/me', auth, async (req, res) => {
  // what is allowed to update
  const updates = Object.keys(req.body) // returns list of keys from req.body
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!' });
  }

  // USE findById for password hashing middleware or mongoose bypasses middleware with findByIdAndUpdate
  try {


    //get user from auth middleware req.user
    //update each field provided by req.body
    updates.forEach(update => req.user[update] = req.body[update]);

    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete logged in user
router.delete('/:id', auth,  async (req, res) => {


  try {
    // const deletedUser = await User.findByIdAndDelete(req.params.id)
    // deletedUser ? res.send(deletedUser) : res.status(404).send()

    // remove using express remove() and req.user from auth middleware
    await req.user.remove();
    res.send(req.user);

  } catch (e) {
    res.status(500).send(e);
  }
})


module.exports = router;
