let clients = {};
const { findUser } = require('./mongoose');

module.exports = function(server, session) {
    const io = require('socket.io')(server);
    io.use(function(socket, next) {
        session(socket.request, socket.request.res, next);
    });
    io.use(function(socket, next) {
        let sess = socket.request.session;
        if (sess.passport && sess.passport.user && sess.passport.user.id && !sess.passport.user.extra) {
            socket.googleID = sess.passport.user.id;
            socket.loggedIn = true;
        } else {
            socket.loggedIn = false;
        }
        next(null);
    });

    io.on('connection', socket => {
        if (socket.loggedIn) {
            findUser(socket.googleID)
                .then(prof => {
                    socket.name = prof.fullName;
                    clients[socket.googleID] = socket;
                    // console.log(clients);
                    socket.on('disconnect', () => {
                        delete clients[socket.googleID];
                    });

                    socket.on('sendPrivate', function(data) {
                        console.log(`from : ${socket.googleID} to ${data.to} : ${data.msg}`);
                        if (typeof clients[data.to] !== 'undefined') {
                            let recvSocket = clients[data.to];
                            io.to(recvSocket.id).emit('recvPrivate', { from: { id: socket.googleID, name: socket.name }, msg: data.msg });
                        }
                    });

                    // socket.emit('syncChats', socket.request.session.currChat);

                    socket.on('addChat', (id, cb) => {
                        console.log(id);
                        if (typeof clients[id] !== undefined) {
                            let rcvSocket = clients[id];
                            let clientName = rcvSocket.name;
                            socket.request.session.currChat = id;
                            cb(clientName);
                        } else {
                            cb(null);
                        }
                    });
                });
        }
    });
};