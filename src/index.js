const express = require('express');

require('./db/mongoose'); // connect to database
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/tasks', taskRouter);
app.use('/users', userRouter);


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// const bcrypt = require('bcryptjs');
// const myFunction = async () => {
//   const password = 'Red12345!';
//   const hashedPassword = await bcrypt.hash(password, 8) // number of rounds hash algorithm is executed => too few == too easy
//   console.log(password);
//   console.log(hashedPassword);

//   const isMatch = await bcrypt.compare('red12345!', hashedPassword);
//   console.log(isMatch);
// }


// myFunction();
