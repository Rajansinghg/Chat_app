const express = require ("express");
const path = require("path");

const app = express();
const server =  require("http").createServer(app);

const io = require("socket.io")(server);

const users = {};

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection",function(socket){


    socket.on("new-user-joined", name => {
        users[socket.id] = name;
        io.emit("connectedUserList", users);
        console.log("users --> "+users)
    });
    socket.on("sendMsg", (data) => {
        const socketId = data.receiverUser
        // io.to(socketId).emit("recive", { message: data.msg, name: users[socket.id] })
        io.to(socketId).emit("chat1", { text: data.msg, username: users[socket.id]})
    });
    socket.on("disconnect", message => {
        delete users[socket.id];
    });


    // console.log("Socket id --> ",socket.rooms);
    socket.on("newuser",function(username){
        socket.broadcast.emit("update",username+" joined the conversation");
    });
    socket.on("exituser",function(username){
        socket.broadcast.emit("update",username+" left the conversation");
    });
    socket.on("chat",function(message){
        socket.broadcast.emit("chat",message);
    });
});

server.listen(5000);
