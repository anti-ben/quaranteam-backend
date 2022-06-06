const moment = require('moment');
const USER_STATUS = ['ONLINE', 'OFFLINE'];
const users = {};

module.exports = server => {
    const io = require('socket.io')(server);

    io.on('connection', socket => {
        socket.on('online', username => {
            socket.username = username;
            users[username] = {
                _id : socket.id,
                status : USER_STATUS[0]
            };
            console.log(`${username} online`);
        });

        socket.on('private_chat',(params, fn) => {
            const recev = users[params.receiver];
            params.createTime = moment().format('YYYY-MM-DD HH:mm:ss');

            fn(params);

            if(recev && recev.status === USER_STATUS[0]){
                socket.to(users[params.receiver]._id).emit('reply_private_chat', params);
            }else{
                console.log(`${params.receiver} 不在线`);
            }
        });

        socket.on('disconnect', reason => {
            console.log(`${reason} disconnect`);
            if(users[socket.username]) users[socket.username].status = USER_STATUS[1];
        });
    });

}
