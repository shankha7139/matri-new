const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const url =
  "mongodb://matri:matri@ac-aia6j0k-shard-00-00.s1c4bwr.mongodb.net:27017,ac-aia6j0k-shard-00-01.s1c4bwr.mongodb.net:27017,ac-aia6j0k-shard-00-02.s1c4bwr.mongodb.net:27017/?ssl=true&replicaSet=atlas-gcq09h-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
const dbName = "sample_users";
const collectionName = "user";

const connectDB = async () => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const documents = await collection.find({}).toArray();
    global.testuser = documents;
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;

// fetchedData.find({}).toArray(function (err, data) {
//     if (data) console.log("data");
//     else {
//       console.log("err");
//     }
//   });

// try {
//     const conn = await mongoose.connect(
//       "mongodb://matri:matri@ac-aia6j0k-shard-00-00.s1c4bwr.mongodb.net:27017,ac-aia6j0k-shard-00-01.s1c4bwr.mongodb.net:27017,ac-aia6j0k-shard-00-02.s1c4bwr.mongodb.net:27017/?ssl=true&replicaSet=atlas-gcq09h-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
//     );
//     console.log(`DATABASE SUCCESSFULLY  CONNECTED - ${conn.connection.host}`);
//     const fetchedData = await mongoose.connection.db.collection("user");

//   } catch (error) {
//     console.log(error.message);
//   }
