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
  const personName = $("#add-person").value;
  console.log("adding person...");
  fetch("/people", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: personName })
  })
    .then(res => console.log(res))
    .then(displayAllPeople);
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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: friendID })
  })
    .then(res => console.log(res))
    .then(displayAllPeople);
};

const removePerson = () => {
  const personID = $("#remove-person").value;
  console.log(`removing person ID=${personID}`);
  fetch("/people/" + personID, {
    method: "DELETE"
  })
    .then(res => console.log(res))
    .then(displayAllPeople);
};
