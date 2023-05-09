const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const sql = require("./config/db.js");

app.get("/", function (req, res) {
  res.render("index.ejs");
});

io.sockets.on("connection", function (socket) {

  socket.on('socket_register', function (user_id) {
    socket.user_id = user_id;
  });


  socket.on("join_room", function (data) {
    console.log(data);
    sql.query(
      "SELECT username FROM travel_pocket.users where id = ? limit 1;",
      [data.user_id],
      (err, res) => {
        if (err) console.log("error: ", err);
        if (res && res.length != 1) console.log("error: ", "User not found");
        socket.username = res[0].username;
        io.emit(
          "is_online",
          "🔵 <i>" + socket.username + " join the chat..</i>"
        );
      }
    );
  });

  socket.on("disconnect", function (username) {
    io.emit("is_online", "🔴 <i>" + socket.username + " left the chat..</i>");
  });

  socket.on("chat_message", async function (data) {
    var saveData = { sender_id: data.sender_id, message: data.message };
    console.log(saveData, 'saveData');
    await sql.query("INSERT INTO group_chat SET ? ", [saveData], (err, res) => {
      if (err) console.log("error: ", err);
      sql.query(
        "SELECT GC.id,GC.sender_id,GC.message,GC.created_at,USR.username,USR.avatar FROM travel_pocket.group_chat GC inner join users USR ON USR.id = GC.sender_id ORDER BY GC.id DESC LIMIT 1 ;",
        (err2, res2) => {
          if (err) console.log("error: ", err2);
          io.emit("new_message_data", res2);
        }
      );
    });
  });

  socket.on("message_history", async (data) => {
    sql.query(
      "SELECT GC.id,GC.sender_id,GC.message,GC.created_at,USR.username,USR.avatar FROM travel_pocket.group_chat GC inner join users USR ON USR.id = GC.sender_id ORDER BY GC.created_at DESC LIMIT 1000 ;",
      (err, res) => {
        if (err) console.log("error: ", err);
        io.emit("message_data", res);

      }
    );
  });
});

const server = http.listen(8088, function () {
  console.log("listening on *:8088");
});
