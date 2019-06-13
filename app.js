"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fetch = require("node-fetch"); // server-side equivalent to browser's fetch()
const Person = require("./models/person");

// Set up the Express app
const app = express();

const MongodbMemoryServer = require("mongodb-memory-server");

const mongoServer = new MongodbMemoryServer.MongoMemoryServer({
  binary: { version: "latest" },
  instance: { port: 65210, dbName: "test" }
});

mongoServer.getConnectionString().then(uri => {
  // Connect to MongoDB - should be running locally
  mongoose.connect(uri).then(() => {
    console.log(`Database started on ${uri}`);
  });
  mongoose.Promise = global.Promise;
});

// Set up static files
app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "public/styles")));
app.use("/scripts", express.static(path.join(__dirname, "public/scripts")));

// Use body-parser to parse HTTP request parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handling middleware
app.use(function(err, req, res, next) {
  console.log(err); // To see properties of message in our console
  res.status(422).send({ error: err.message });
});

const PORT = process.env.PORT || 3000;

// Starts the Express server, which will run locally @ localhost:3000
app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}!`);
});

// Serves the index.html file (our basic frontend)
app.get("/", function(req, res) {
  res.sendFile("index.html", { root: __dirname });
});

// GET route that displays all people (finds all Person objects)
app.get("/people", (req, res, next) => {
  console.log("get people...");
  Person.find({})
    .then(
      result => res.send(result) // Sends the result as JSON
    )
    .catch(err => console.log(err));
});

// GET route that displays one person's friends
app.get("/people/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(
      result => res.send(result.friends) // Returns the person's friends array as JSON
    )
    .catch(err => console.log(err));
});

// POST route that adds a new Person object
app.post("/people", (req, res, next) => {
  if (!req.body.name) {
    console.error("Name must be provided as a POST parameter.");
  }
  // First gets a random dog image URL
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(data => data.json())
    .then(data => {
      console.log(data);
      if (data.status !== "success") {
        return;
      }
      const person = new Person();
      person.name = req.body.name; // Stores the 'name' string
      person.dog = data.message; // Stores the 'dog' image URL
      person.friends = []; // Initializes an empty array of friends
      person.save((err, person) => {
        if (err) {
          console.error(err);
        }
        // Saves the Person object to the database
        res.send(person); // Returns the new object as JSON
      });
    })
    .catch(err => console.log(err));
});

// PUT route that adds a friend to a person
const addFriend = (userID, friendID) => {
  return Person.findById(userID)
    .then(person => {
      if (!person) {
        console.log(`Person ID=${userID} not found`);
        return;
      }
      // Finds a Person by id (param in URL)
      person.friends.push(friendID); // Adds the friend with ID in POST parameters
      person.save(err => {
        // Saves the Person object
        if (err) {
          console.log(err);
          return;
        }
      });
    })
    .catch(err => console.log(err));
};
app.put("/people/:id", (req, res, next) => {
  // add A to B's friends
  addFriend(req.param.id, req.body.id)
    .then(() => {
      // add B to A's friends
      addFriend(req.body.id, req.param.id);
    })
    .then(() => {
      res.send(
        "Friendship between " +
          req.body.id +
          " and " +
          req.params.id +
          "created!"
      );
    })
    .catch(err => console.log(err));
});

// DELETE route that removes a Person object from the database
app.delete("/people/:id", (req, res, next) => {
  console.log(`deleting person ID=${req.params.id}`);
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.send("Deleted person with id " + req.params.id);
    })
    .catch(err => console.log(err));
});
