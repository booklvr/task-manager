const jwt = require('jsonwebtoken');
const User = require('../models/user');


// authorization middleware using jwt token for routes
// * all routes except post(/users/) and post(/users/login)
const auth = async (req, res, next) => {
    try {
        // req.header returns auth token plus beaerer
        // * remove bearer
        const token = req.header('Authorization').replace('Bearer ', '');

        // compare auth token with
        const decoded = jwt.verify(token, 'thisismynewcourse');

        //find user with correct id that has authentication token still stored in their tokens array
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });


        if(!user) {
            throw new Error()
        }

        // provide token so session knows which token to logout
        req.token = token;

        // provide next route with user so that they don't have to search again
        // *  route should use req.user, not User.findById(id)
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}


module.exports = auth;
