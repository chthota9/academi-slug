var chatBox = document.querySelector('.chatBox');
var inputBox = chatBox.querySelector('.inputBox');
var miniIcon = chatBox.querySelector('.minimize');
var chatContainer = chatBox.querySelector('.chatContainer');
var chatLinks = [...document.getElementsByClassName('.chat-link')];
var chatNameTitle = chatBox.querySelector('.chatNameTitle');
var minimized = true;
var chattingWith = {};
var currChat;
// eslint-disable-next-line no-undef
var socket = io();

chatLinks.forEach(link => {
    link.addEventListener('click', evt => evt.preventDefault());
});

inputBox.addEventListener('keydown', evt => {
    var key = evt.key || evt.keyCode;
    if (key === 'Enter') {
        socket.emit('sendPrivate', { msg: inputBox.value, to: currChat });
        var node = document.createElement('div');
        var textnode = document.createTextNode(inputBox.value);
        node.classList.add('chat', 'send');
        node.appendChild(textnode);
        chatContainer.appendChild(node);
        inputBox.value = '';
    }
});

miniIcon.addEventListener('click', changeChatBoxState);

function changeChatBoxState () {
    if (minimized) {
        chatBox.classList.remove('minimized');
        minimized = false;
    } else {
        chatBox.classList.add('minimized');
        minimized = true;
    }
}

function addChat (id) {
    socket.emit('addChat', id, function(name) {
        if (name) {
            console.log(name);
            chattingWith[id] = name;
            chatNameTitle.textContent = name;
            currChat = id;
        }
    });
}

socket.on('recvPrivate', function(data) {
    console.log(`${data.from.name} : msg ${data.msg}`);
    let name = data.from.name;
    let id = data.from.id;
    if (typeof chattingWith[id] === 'undefined') {
        chattingWith[id] = name;
    }
    var node = document.createElement('div');
    var textnode = document.createTextNode(data.msg);
    node.classList.add('chat', 'recv');
    node.appendChild(textnode);
    chatContainer.appendChild(node);

});

socket.on('syncChats', function(data) {
    if (data) {
        chattingWith = data;
    }
});