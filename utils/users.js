const users = [];

// JOIN USERS TO CHAT
function userJoin(id,username,room){
    const user = {
        id:id,
        username:username,
        room:room
    }
    users.push(user)
    return user;
}

// GET CURRENT USER
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

// user leave chats
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

// GET ROOM USERS

function getRoomUser(room){
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUser
}