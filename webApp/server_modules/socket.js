let clients = {};
const { findUser } = require('./mongoose');
const maxSavedChat = 5;
let io = require('socket.io');
const socketsess = require('express-socket.io-session');

module.exports = function(server, session) {
    io = io(server);
    io.use(socketsess(session));

    io.use(function(socket, next) {
        let sess = socket.handshake.session;
        if (sess.passport && sess.passport.user &&
            sess.passport.user.id && !sess.passport.user.extra) {
            socket.googleID = sess.passport.user.id;
            socket.loggedIn = true;
            if (typeof sess.chatSessions === 'undefined') {
                sess.chatSessions = {};
                sess.currChat = null;
            }
        } else {
            socket.loggedIn = false;
        }
        sess.save();
        next(null);
    });

    io.on('connection', socket => {
        if (socket.loggedIn) {
            addToClients(socket);
        }
    });
};


function addToClients (socket) {
    findUser(socket.googleID)
        .then(prof => {
            socket.name = prof.fullName;
            clients[socket.googleID] = socket;
            socket.emit('chatSync', { chatSessions: socket.handshake.session.chatSessions, currChat: socket.handshake.session.currChat });
            socket.on('disconnect', () => {
                console.log('Disconnect');
                delete clients[socket.googleID];
            });

            socket.on('sendPrivate', function(data) {
                console.log(`from : ${socket.googleID} to ${data.to} : ${data.msg}`);
                if (typeof clients[data.to] !== 'undefined') {
                    let recvSocket = clients[data.to];
                    addToChatSessions(socket, recvSocket, data.msg);
                    io.to(recvSocket.id).emit('recvPrivate', { from: { id: socket.googleID, name: socket.name }, msg: data.msg });
                } else {
                    //Theyre offline
                }
            });


            socket.on('addChat', (id, cb) => {
                console.log(id);
                if (typeof clients[id] !== undefined) {
                    let rcvSocket = clients[id];
                    let clientName = rcvSocket.name;
                    // socket.request.session.currChat = id;
                    cb(clientName);
                } else {
                    cb(null);
                }
            });
        });
}

function addToChatSessions (fromSocket, toSocket, newMsg) {
    let sess = fromSocket.handshake.session;
    let toID = toSocket.googleID;
    
    if (sess.chatSessions[toID] !== undefined) {
        /**
         * @type {Array} chatSess;
         */
        let chatObj = sess.chatSessions[toID];
        let chatSess = chatObj.chatSess;
        if (chatSess.length === maxSavedChat) {
            chatSess.shift();
            chatSess.push(newMsg);
        } else {
            chatSess.push(newMsg);
        }
    } else {
        let toName = toSocket.name;
        sess.chatSessions[toID] = {
            name:toName,
            chatSess:[newMsg]
        };
    }
    sess.save();
}