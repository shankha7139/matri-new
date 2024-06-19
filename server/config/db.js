const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://matri:zsxxxd8YVGOh1FC0@cluster0.s1c4bwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "test";
const collectionName = "users";

const connectDB = async () => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connectedddd!"))
    .catch((err) => console.log(err));

  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const documents = await collection.find({}).toArray();
    global.testuser = documents;
    // console.log(testuser);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;

