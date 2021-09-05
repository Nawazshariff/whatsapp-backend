const express = require("express");
const db = require("./db");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const Message = require("./models/messages");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json("Hi this is backend");
});

app.post("/message/new", (req, res) => {
  let message = new Message(
    req.body.name,
    req.body.message,
    req.body.timestamp,
    req.body.recieved
  );
  db.getDB()
    .db()
    .collection(process.env.db_msg_coll)
    .insertOne(message.getDetails())
    .then((success) => {
      return res.status(201).json({ message: "Created" });
    })
    .catch((err) => {
      return res.status(500).send("Internal Server Error");
    });
});

app.get("/messages/sync", (req, res) => {
  db.getDB()
    .db()
    .collection(process.env.db_msg_coll)
    .find({})
    .toArray()
    .then((data) => {
      const messages = [];
      data.forEach((arr) => {
        let message = new Message(
          arr.name,
          arr.message,
          arr.timestamp,
          arr.recieved
        );
        messages.push(message.getDetails());
      });
      console.log(messages);
      return res.status(200).json(messages);
    })
    .catch((err) => {
      return res.status(500).send("Internal Server Error");
    });
});

db.initDB((err, _db) => {
  if (err) console.error(err);
  else {
    app.listen(port, () => {
      console.log("Server running at the port " + port);
      db.checkChangeStream(process.env.db_msg_coll);
    });
  }
});
