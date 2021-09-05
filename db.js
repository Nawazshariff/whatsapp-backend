const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const puhser = require("./pusher");
const url = `mongodb+srv://${process.env.db_user}:${process.env.db_pwd}@whatsapp0.unwh0.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority`;
let _db;

const initDB = (callback) => {
  if (_db) {
    console.log("Database already initialized");
    return callback(null, _db);
  } else {
    mongoClient
      .connect(url)
      .then((client) => {
        _db = client;
        return callback(null, _db);
      })
      .catch((err) => {
        return callback(err);
      });
  }
};

const getDB = () => {
  if (!_db) {
    throw Error("Database not initialized");
  } else {
    return _db;
  }
};

const checkChangeStream = (collectionName) => {
  const coll = getDB().db().collection(collectionName);
  const changeStream = coll.watch();
  const options = { fullDocument: "updateLookup" };
  changeStream.on(
    "change",
    (change) => {
      console.log("colleciton changed ");
      if (change.operationType === "insert") {
        const messageDetails = change.fullDocument;
        puhser.trigger("whatsapp", "inserted", {
          name: messageDetails.name,
          message: messageDetails.message,
          timestamp: messageDetails.timestamp,
          recieved: messageDetails.recieved,
        });
      } else {
        console.log("Error triggering pusher");
      }
    },
    options
  );
};

module.exports = {
  initDB,
  getDB,
  checkChangeStream,
};
