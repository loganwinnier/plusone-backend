
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");
const { prisma } = require("./prisma");


function socketController(chats) {

    //Socket middleware sets allowed rooms for user. 
    chats.use(async (socket, next) => {
        const authHeader = socket.handshake.auth;
        if (authHeader) {
            const token = authHeader.token;
            try {
                let decoded = jwt.verify(token, SECRET_KEY);
                user = await prisma.user.findUniqueOrThrow({
                    where: { email: decoded.email },
                    include: {
                        chatsUserOne: true,
                        chatsUserTwo: true
                    }
                });
                socket.allowedChats = user.chats.map(chat => chat.id);
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("No token: ", authHeader.token);
        }

        next();
    });

    chats.on("connection", (socket) => {
        socket.join(socket.allowedChats);
        console.log("AUTH:", socket.handshake.auth.token);
        socket.emit("connected-message", "Connected to client");

        socket.on("set-chat", async (id) => {
            if (!socket.allowedChats?.includes(id)) {
                console.log("Not allowed to join this room");
            }
        });

        socket.on("send-message", async (message, room, sender, callback) => {
            console.log("ROOM", room);
            const recipient = room.userOneEmail === sender
                ? room.userTwoEmail : room.userOneEmail;
            try {
                const newMessage = await prisma.message.create({
                    data: {
                        sender,
                        recipient,
                        content: message,
                        sentAt: new Date(),
                        chat: {
                            connect: {
                                id: room.id
                            }
                        }
                    },
                });
                const chat = await prisma.chat.update({
                    where: {
                        id: room.id,
                    },
                    data: {
                        lastMessage: new Date(),
                        lastMessageContent: message
                    },
                    include: {
                        userOne: {
                            include: {
                                profile: { include: { images: true } }
                            }
                        },
                        userTwo: {
                            include: {
                                profile: { include: { images: true } }
                            }
                        },
                    },
                });
                callback({ message: newMessage });
                socket.to(room.id).emit("receive-message", newMessage);
                console.log("Updating Chat", socket.allowedChats);
                for (let allowedChat of socket.allowedChats) {
                    console.log(allowedChat);
                    socket.nsp.to(allowedChat).emit("chat-update", chat);
                }
                console.log("done");
            } catch (err) {
                console.log(err);
            }
        });
    });
}

module.exports = socketController;