$(() => {
    $('#send').click(() => {
        sendMessage({
            name: $('#name').val(),
            message: $('#message').val()
        });
    });
    getMessages();
});

function addMessages (message) {
    $('#messages').append(`
               <h4> ${message.name} </h4>
               <p> ${message.message} </p>`)
}

function getMessages () {
    $.get('http://localhost:5000/message', (data) => {
        data.forEach(addMessages);
    });
}

function sendMessage (message) {
    $.post('http://localhost:5000/message', message);
}