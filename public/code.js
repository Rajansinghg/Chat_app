(function () {
    const app = document.querySelector(".app");
    var audio = new Audio("ting.mp3");
    const socket = io();
    let chatterUser = null;
    let uname;
    let receiverUser = null;
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
        let username = (app.querySelector(".join-screen #username").value).charAt(0).toUpperCase() + (app.querySelector(".join-screen #username").value).slice(1);
        if (username.length == 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active")
        app.querySelector(".chat-screen").classList.add("active")
        // Added By Rajan 
        const nameChatter = username;
        socket.emit("new-user-joined", nameChatter);
        // End

    });
    document.getElementById("username").addEventListener("keypress", function (event) {
        console.log("Rajan in enter on join screen--> ");
        if (event.key === "Enter") {
            let username = (app.querySelector(".join-screen #username").value).charAt(0).toUpperCase() + (app.querySelector(".join-screen #username").value).slice(1);
            if (username.length == 0) {
                return;
            }
            socket.emit("newuser", username);
            uname = username;
            app.querySelector(".join-screen").classList.remove("active")
            app.querySelector(".chat-screen").classList.add("active")
            // Added By Rajan 
            const nameChatter = username;
            socket.emit("new-user-joined", nameChatter);
            // End
        }
    });

    app.querySelector(".chat-screen #groupchat").addEventListener("click", function () { // added for group chat btn
        receiverUser = null;
        document.getElementById("messages1").innerHTML = ""
        document.getElementById("logo1").innerText = "GroupChat";
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {


        let message = app.querySelector(".chat-screen #message-input").value;
        console.log(message);
        if (message.length == 0) {
            return;
        }

        readerMessage("my", {
            username: uname,
            text: message
        });

        if (receiverUser != null) {

            socket.emit("sendMsg", { msg: message, receiverUser: receiverUser });

        } else {
            console.log("receiverUser is Empty click--> ");
            console.log(uname, message);
            socket.emit("chat", {
                username: uname,
                text: message
            });
        }

        app.querySelector(".chat-screen #message-input").value = "";
    });

    document.getElementById("message-input").addEventListener("keypress", function (event) {
        console.log("Rajan in enter --> ");
        if (event.key === "Enter") {
            let message = app.querySelector(".chat-screen #message-input").value;
            console.log(message);
            if (message.length == 0) {
                return;
            }

            readerMessage("my", {
                username: uname,
                text: message
            });

            if (receiverUser != null) {

                socket.emit("sendMsg", { msg: message, receiverUser: receiverUser });

            } else {
                console.log("receiverUser is Empty click--> ");
                console.log(uname, message);
                socket.emit("chat", {
                    username: uname,
                    text: message
                });
            }

            app.querySelector(".chat-screen #message-input").value = "";
        }
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname)
        window.location.href = window.location.href;
    });

    socket.on("update", function (update) {
        console.log("Socket update --> ")
        readerMessage("update", update);
    });

    socket.on("chat1", function (data) {
        console.log("Socket chat1 --> ", data)
        readerMessage("other", data);
    });
    socket.on("chat", function (message) {
        console.log("Socket chat --> ")
        readerMessage("other", message);
    });
    // Added By rajan --> 
    const OnlineUserContainer = document.querySelector(".OnlineUserContainer");
    socket.on("connectedUserList", data => {
        console.log("connectedUserList Called --> ");
        document.getElementById("test2").innerHTML = ""
        const ul = document.createElement('ul');
        Object.keys(data).map(keyName => {
            if (keyName !== socket.id) {
                const li = document.createElement('li');
                li.textContent = data[keyName];
                li.setAttribute("id", keyName);
                li.setAttribute("class", "user-name")
                ul.appendChild(li);
                OnlineUserContainer.append(ul);
            }
        })
    })

    OnlineUserContainer.addEventListener("click", function (event) {
        console.log("list got response -->");
        if (event.target.classList.contains("user-name")) {
            const getId = event.target.getAttribute("id"); // Use event.target instead of event
            console.log("chatterUser==== ", chatterUser)
            if (chatterUser !== getId) {
                chatterUser = getId
                document.getElementById("messages1").innerHTML = ""
                document.getElementById("logo1").innerText = event.target.textContent;
            }
            const playerChat = {
                userId: getId,
                name: event.target.textContent
            }
            receiverUser = getId
        }
    });


    function sendmsg() {
        const msg = document.getElementById("messageInp").value;
        if (!receiverUser) {
            alert("please select a connected User")
        }
        console.log("receiverUser ----------- ", receiverUser)
        if (msg.length != 0 && receiverUser != null) {
            socket.emit("sendMsg", { msg: msg, receiverUser: receiverUser });
            append(`${nameChatter}: ${msg}`, "right")
        }
        document.getElementById("messageInp").value = ""
    }

    // End -->

    function readerMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        console
        if (type == "my") {
            let el = document.createElement("div");
            console.log("El my--> ", el);
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
            <div>
                <div class = "name">You</div>
                <div class = "text">${message.text}</div>
            </div>`;
            messageContainer.appendChild(el);
        }
        else if (type == "other") {
            audio.play();
            let el = document.createElement("div");
            console.log("El other--> ", el);
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
            <div>
                <div class = "name">${message.username}</div>
                <div class = "text">${message.text}</div>
            </div>`;
            messageContainer.appendChild(el);
        } else if (type == "update") {
            audio.play();
            let el = document.createElement("div");
            console.log("El update--> ", el);
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        // scroll chat to end 
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    };

})();