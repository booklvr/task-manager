const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const multer = require('multer');  // required for file uploads
const sharp = require('sharp');  // convert and resize images

const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');

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

    // send welcome email using sendgrid from
    sendWelcomeEmail(user.email, user.name);

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

// MULTER middlware for POST /user/me/avatar
const upload = multer({
  // dest: 'avatars',  // provide file for uploaded images in route directory (remove to pass file through function)
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) { // req, file-info, callback
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // restrict file type to jpg jpeg or png -> originalname from multer docs
      return cb(new Error('File must be .jpg, .jpeg, or .png file type'));
    }

    cb(undefined, true); // success
    // cb(undefined, false); // silently reject
  }
})

// POST Avatar
// * upload.single() is middleware provided by multer
//  -> upload.single() requires an argument we are just calling upload
//  -> 'upload' must match key value in req.body (key value pair in postman)
router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {  // async for req.user.save()

  // * use sharp to resize photo and convert to png format
  //  -> req.file.buffer is from multer and contains binary info form the image uploaded
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

  req.user.avatar = buffer;
  await req.user.save();  // save file to user profile
  res.send();
}, (error, req, res, next) => { // all four arguments needed so express knows to expect an error
  res.status(400).send({error: error.message }); // error from upload.single multer middleware
})

// GET Avatar
// image available at URL  just include in image src in html markup.
router.get('/:id/avatar', async (req, res) => {

  try {
    const user = await User.findById(req.params.id)

    if (!user | !user.avatar) {
      throw new Error(); // no error message because not sending error message bellow
    }

    // create response header
    // * res.set takes in key value pair { nameOfResponseHeader: valueTryingToSet }
    res.set('Content-Type', 'image/png');   // we know it is png because we converted using sharp in post route
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }

})

// DELETE Avatar
router.delete('/me/avatar', auth, async (req, res) => {

  try {

    // remove using express remove() and req.user from auth middleware
    req.user.avatar = undefined; // this deletes binary data from req.user.avatar
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});





// UPDATE user
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
router.delete('/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send();
  }
})


module.exports = router;
