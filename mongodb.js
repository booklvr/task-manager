// CRUD create read update delete

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;
const { MongoClient, ObjectID } = require ('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';



MongoClient.connect(connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error, client) => {
    if (error) {
      return console.log('Unable to connect to database');
    }
    console.log('Connected correctly');

    const db = client.db(databaseName);

    // db.collection('users').drop();
    // db.collection('tasks').drop();
    // db.collection('users').findOne({ name: "Nick" }, (err, user) => {
    //   err ? console.log(err) : console.log(user);
    // })

    // db.collection('users').find().toArray((err, users) => {
    //   console.log(users);
    // });

    // db.collection('users').findOne({_id: new ObjectID("5e35d1cdcfe9ec0cb15d0c7a")}, (err, user) => {
    //   err ? console.log(error) : console.log(user);
    // })
    // db.collection('tasks').find({ completed: true}).toArray((err, tasks) => err ? console.log(err) : console.log( tasks));


    // const updatePromise = db.collection('users').updateOne({
    //   _id: new ObjectID('5e35d1cdcfe9ec0cb15d0c7a')
    // }, {
    //   $set: {
    //     name: 'Mike'
    //   },
    //   $inc: {
    //     age: 1
    //   }
    // });

    // updatePromise
    //   // .then(res => console.log(res))
    //   .catch(err => console.log(err));

    // const updateTasks = db.collection('tasks').updateMany({
    //   completed: true
    // }, {
    //   $set: {
    //     completed: false
    //   }
    // })

    // updateTasks
    //   .then(res => console.log('update successful'))
    //   .catch(err => console.log(err));

    const createTask = db.collection('tasks').insertMany([
      {
        task: 'run',
        completed: false
      },
      {
        task: 'compete',
        completed: true
      }
    ])

    // const deleteOneTask = db.collection('tasks').deleteOne({
    //   _id: new ObjectID('5e35d1cdcfe9ec0cb15d0c7c')
    // })

    // deleteOneTask
    //   .then(res => console.log(`deleted ${res.task}`))
    //   .catch(err => console.log(err));

    // const deleteAllTasks = db.collection('tasks').deleteMany()

    // deleteAllTasks
    //   .then(res => console.log('deleted many'))
    //   .catch(err => console.log(err));


});
