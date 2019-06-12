"use strict";

const SERVER = "localhost:3000";

// initial load
window.onload = () => {
  $.get(SERVER + "/people", data => {
    $("#get-all-container").html(JSON.stringify(data, null, 2));
  });
};

const addPerson = () => {
  console.log("adding person...");
  $.ajax({
    type: "POST",
    url: SERVER + "/people",
    data: { name: $("#add-person").val() },
    success: () => {
      console.log("success.");
      $.get(SERVER + "/people", data => {
        $("#get-all-container").html(JSON.stringify(data, null, 2));
      });
    }
  });
};

const getFriends = () => {
  const personID = $("#get-friends").val();
  $.get(SERVER + "/people/" + personID, data => {
    $("#get-friends-container").html(JSON.stringify(data, null, 2));
  });
};

const addFriends = () => {
  const personID = $("#add-friend-self").val();
  const friendID = $("#add-friend-friend").val();
  $.ajax({
    type: "PUT",
    url: SERVER + "/people/" + personID,
    data: { id: friendID },
    success: () => {
      $.get(SERVER + "/people", data => {
        $("#get-all-container").html(JSON.stringify(data, null, 2));
      });
    }
  });
};

const removePerson = () => {
  const personID = $("#remove-person").val();
  $.ajax({
    type: "DELETE",
    url: SERVER + "/people/" + personID,
    success: () => {
      $.get(SERVER + "/people", data => {
        $("#get-all-container").html(JSON.stringify(data, null, 2));
      });
    }
  });
};
