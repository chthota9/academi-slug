var chatBox = document.querySelector('.chatBox');
var inputBox = chatBox.querySelector('.inputBox');
var miniIcon = chatBox.querySelector('.minimize');
var chatContainer = chatBox.querySelector('.chatContainer');
var chatLinks = [...document.getElementsByClassName('.chat-link')];
var chatNameTitle = chatBox.querySelector('.chatNameTitle');
var dropDownArrow = chatNameTitle.querySelector('.dropDownArrow');
var chatList = chatNameTitle.querySelector('.chatList');
var minimized = true;
var chatListMinimized = true;
var chatInstances = {};
var currChatInstance;
// eslint-disable-next-line no-undef
var socket = io();

socket.on('recvPrivate', function(data) {
    console.log(`${data.from.name} : msg ${data.msg}`);
    let name = data.from.name;
    let id = data.from.id;
    chatNameTitle.textContent = name;
    currChatInstance = id;
    var node = document.createElement('div');
    var textnode = document.createTextNode(data.msg);
    node.classList.add('chat', 'recv');
    node.appendChild(textnode);
    chatContainer.appendChild(node);
    node.scrollIntoView();
    inputBox.disabled = false;
});
socket.on('chatSync', function(syncData) {
    console.log(syncData);
});

function deleteChat () {
    let newChat = chatContainer.cloneNode(false);
    chatContainer.parentNode.replaceChild(newChat, chatContainer);
    chatContainer = newChat;
}

function addChat (id) {
    socket.emit('addChat', id, function(name) {
        if (name) {
            chatInstances[id] = name;
            chatNameTitle.childNodes[0].textContent = name;
            currChatInstance = id;
            inputBox.disabled = false;
            inputBox.focus();
            if (minimized) {
                changeChatBoxState();
            }
        }
    });
}

changeCurrentChatInstance(id,name){
    if(chatInstances[id] !== undefined){
        currChatInstance = chatInstances[id].chatContainer;
    }
}

miniIcon.addEventListener('click', changeChatBoxState);
chatNameTitle.childNodes[0].addEventListener('click', dropDownMenu);
dropDownArrow.addEventListener('click',dropDownMenu);

function dropDownMenu () {
    if (chatListMinimized) {
        chatList.classList.remove('hidden');
    }
    else{
        chatList.classList.add('hidden');
    }
    chatListMinimized = !chatListMinimized;
}

function changeChatBoxState () {
    if (minimized) {
        chatBox.classList.remove('minimized');
    } else {
        chatBox.classList.add('minimized');
    }
    minimized = !minimized;
}
chatLinks.forEach(link => {
    link.addEventListener('click', evt => evt.preventDefault());
});

inputBox.addEventListener('keydown', evt => {
    var key = evt.key || evt.keyCode;
    let msg = inputBox.value;
    if (key === 'Enter' && currChatInstance && msg !== '') {
        socket.emit('sendPrivate', { msg, to: currChatInstance });
        var node = document.createElement('div');
        var textnode = document.createTextNode(msg);
        node.classList.add('chat', 'send');
        node.appendChild(textnode);
        chatContainer.appendChild(node);
        node.scrollIntoView();
        inputBox.value = '';
    }
});

function ChatInstance(id,name) {
    let chatContainer = document.createElement('div');
    chatContainer.classList.add('chatContainer');
    this.addToChat = function (newMsg) {
        let node = document.createElement('div');
        let textNode = document.createTextNode(newMsg);
        node.classList.add('chat','send');
        node.appendChild(textNode);
        chatContainer.appendChild(node);
    };
}