const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let database;

async function connectToDatabase(){
    // console.log("Connecting to Db Pleas wait");
const client =  await MongoClient.connect('mongodb://0.0.0.0:27017');
database = client.db('online-shop');
//database = client.db('local');
}

function getDb(){
    if(!database){
        throw new Error('You must connect first!');
    }
    return database;
}

module.exports={
    connectToDatabase:connectToDatabase,
    getDb:getDb
};

// const {MongoClient} = require('mongodb');
// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);

// async function getData(){
//     let result = await client.connect();
//     let db = result.db('wde');
//     let collection = db.collection('users');
//     let response = await collection.find({}).toArray();
//     console.log(response);
// }
// getData();