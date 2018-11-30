var chatBox = document.querySelector('.chatBox');
var inputBox = chatBox.querySelector('.inputBox');
var miniIcon = chatBox.querySelector('.minimize');
var chatContainer = chatBox.querySelector('.chatContainer');
var chatLinks = [...document.getElementsByClassName('.chat-link')];
var chatNameTitle = chatBox.querySelector('.chatNameTitle');
var minimized = true;
var chatListMinimized = true;
const chatHandler = new ChatInstanceHandler(chatNameTitle.querySelector('.dropDownArrow'), chatNameTitle.querySelector('.chatList'), chatNameTitle.childNodes[0]);

// eslint-disable-next-line no-undef
var socket = io();

socket.on('recvPrivate', function(data) {
    console.log(`${data.from.name} : msg ${data.msg}`);
    let name = data.from.name;
    let id = data.from.id;
    chatHandler.addMsg(id, name, data.msg, 'recv');
    inputBox.disabled = false;
});
socket.on('chatSync', function(syncData) {
    console.log(syncData);
    let chatSessions = syncData.chatSessions;
    let currChat = syncData.currChat;
    let IDs = Object.keys(chatSessions);
    IDs.forEach(id => {
        let chatObj = chatSessions[id];
        let chatSess = chatObj.chatSess;
        chatHandler.createNewChatInstance(id, chatObj.name, currChat === id);
        inputBox.disabled = false;
        chatSess.forEach(msg => chatHandler.addMsg(id, chatObj.name, msg.msg, msg.state));
    });
});

function addChat (id) {
    socket.emit('addChat', id, function(name) {
        if (name) {
            chatHandler.createNewChatInstance(id, name, true);
            inputBox.disabled = false;
            inputBox.focus();
            if (minimized) {
                changeChatBoxState();
            }
        }
    });
}

function deleteChat (id) {
    chatHandler.deleteChatInstance(id);
    socket.emit('deleteChat', id);
}

miniIcon.addEventListener('click', changeChatBoxState);

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
    if (key === 'Enter' && chatHandler.hasCurrChatInstance && msg !== '') {
        let currentChatID = chatHandler.currChatInstance.id;
        socket.emit('sendPrivate', { msg, to: currentChatID });
        chatHandler.addMsg(currentChatID, null, msg, 'send');
        inputBox.value = '';
    }
});

/**
 * @param {Number} id
 * @param {String} name
 */
function ChatInstance (id, name) {
    this.id = id;
    this.name = name;
    this.chatContainer = document.createElement('div');
    this.chatContainer.classList.add('chatContainer');
    let recentChatMsg = null;
    /**
     * @param {String} newMsg
     * @param {String} state
     */
    this.addToChat = (newMsg, state) => {
        let node = document.createElement('div');
        let textNode = document.createTextNode(newMsg);
        node.classList.add('chat', state);
        node.appendChild(textNode);
        this.chatContainer.appendChild(node);
        recentChatMsg = node;

    };
    this.scrollIntoView = () => {
        recentChatMsg.scrollIntoView();
    };
}

function ChatInstanceHandler (downArrow, nameList, chatTitle) {
    let chatInstances = {};
    let dropDownArrow = downArrow;
    let chatList = nameList;
    let nameTitle = chatTitle;
    let numOfChats = 0;
    this.currChatInstance = null;
    this.hasCurrChatInstance = false;

    this.addMsg = (id, name, newMsg, state) => {
        if (chatInstances[id] !== undefined) {
            chatInstances[id].addToChat(newMsg, state);
        } else {
            chatInstances[id] = new ChatInstance(id, name);
            chatInstances[id].addToChat(newMsg, state);
        }
        if (!this.currChatInstance) {
            setAsCurrentChat(chatInstances[id]);
        }
        if (this.currChatInstance == chatInstances[id]) {
            this.currChatInstance.scrollIntoView();
        }
    };

    function dropDownMenu () {
        if (chatListMinimized) {
            chatList.classList.remove('hidden');
        } else {
            chatList.classList.add('hidden');
        }
        chatListMinimized = !chatListMinimized;
    }

    let setAsCurrentChat = (chatInstance) => {
        this.hasCurrChatInstance = true;
        if (!this.currChatInstance) {
            let chatInst = chatBox.querySelector('.chatContainer');
            chatInst.parentNode.replaceChild(chatInstance.chatContainer, chatInst);
        } else {
            let oldChatCon = this.currChatInstance.chatContainer;
            let newChatCon = chatInstance.chatContainer;
            oldChatCon.parentNode.replaceChild(newChatCon, oldChatCon);
        }
        this.currChatInstance = chatInstance;
        nameTitle.textContent = this.currChatInstance.name;
        socket.emit('setCurrentChat', chatInstance.id);
    };
    this.switchCurrentChat = (id) => {
        setAsCurrentChat(chatInstances[id]);
    };
    this.createNewChatInstance = (id, name, setCurrent) => {
        numOfChats++;
        if (chatInstances[id] === undefined) {
            chatInstances[id] = new ChatInstance(id, name);
            let chatTitle = document.createElement('span');
            chatTitle.classList.add('chats');
            let textNode = document.createTextNode(name);
            chatTitle.appendChild(textNode);
            chatTitle.addEventListener('click', () => {this.switchCurrentChat(id);dropDownMenu();});
            chatList.appendChild(chatTitle);

            if (numOfChats > 1) {
                dropDownArrow.classList.remove('hidden');
                nameTitle.addEventListener('click', dropDownMenu);
                dropDownArrow.addEventListener('click', dropDownMenu);
            }
            if (setCurrent) {
                setAsCurrentChat(chatInstances[id]);
            }
        }
    };
    this.deleteChatInstance = (idToDelete) => {
        numOfChats--;
        let IDs = Object.keys(chatInstances).filter(id => id !== idToDelete);
        if (IDs.length < 1) {
            let oldChat = this.currChatInstance;
            let newChat = document.createElement('div');
            newChat.classList.add('chatContainer');
            oldChat.parentNode.replaceChild(newChat, oldChat);
            nameTitle.textContent = 'Live Chat';
            this.currChatInstance = null;
        } else {
            this.switchCurrentChat(IDs[0]);
        }
        delete chatInstances[idToDelete];
        if (numOfChats < 1) {
            dropDownArrow.classList.add('hidden');
            nameTitle.removeEventListener('click', dropDownMenu);
            dropDownArrow.removeEventListener('click', dropDownMenu);
        }
    };
}