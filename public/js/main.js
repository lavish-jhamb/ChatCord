const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

// GET username and room from url
const {username , room } = Qs.parse(location.search , {
    ignoreQueryPrefix:true
});


const socket = io();

// join chatroom
socket.emit('joinRoom' , {username , room})

// get room and user
socket.on('roomUser' , ({room ,users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// MESSAGE FROM SERVER
socket.on('message', message => {
    outputMessage(message);
    // SCROLL DOWN
    chatMessages.scrollTop = chatMessages.scrollHeight;
})


// MESSAGE SUBMIT
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();
    // GET MESSAGE TEXT
    const msg = e.target.elements.msg.value;
    // EMIT MESSAGE TO SERVRE
    socket.emit('chatMessage',msg);
    // CLEAR INPUT FIELD
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

})

// outputMessage

// HERE PARAMETER IS AN OBJECT {MESSAGE}
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}

// add users to dom
function outputUsers(users){
    usersList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
}
