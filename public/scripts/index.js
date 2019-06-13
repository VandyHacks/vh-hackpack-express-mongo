"use strict";

// get element from DOM
var $ = str => document.querySelector(str);

const displayAllPeople = () => {
  fetch("/people")
    .then(data => data.json())
    .then(data => {
      console.log(data);
      $("#get-all-container").innerHTML = JSON.stringify(data, null, 2);
    })
    .catch(err => console.error(err));
};

// initial load
window.onload = () => {
  displayAllPeople();
};

const addPerson = () => {
  console.log("adding person...");
  fetch("/people", {
    method: "POST",
    body: JSON.stringify({ name: $("#add-person").value })
  }).then(displayAllPeople);
};

const getFriends = () => {
  const personID = $("#get-friends").value;
  fetch("/people/" + personID).then(data => {
    $("#get-friends-container").innerHTML = JSON.stringify(data, null, 2);
  });
};

const addFriend = () => {
  const personID = $("#add-friend-self").value;
  const friendID = $("#add-friend-friend").value;
  fetch("/people/" + personID, {
    method: "PUT",
    body: JSON.stringify({ id: friendID })
  }).then(displayAllPeople);
};

const removePerson = () => {
  const personID = $("#remove-person").value;
  fetch("/people/" + personID, {
    method: "DELETE"
  }).then(displayAllPeople);
};
