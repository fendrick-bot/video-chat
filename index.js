const express = require('express');
const path = require('path');
const http = require('http');



const app = express();

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;


const { Server: SocketIO } = require('socket.io');

const io = new SocketIO(server);


const users = [];



io.on('connection', socket => {
    console.log('user connected ' + socket.id);
    if (users.length < 2) users.push(socket.id);
    else console.log("room full");

    if (users.length >= 2) {
        console.log("Starting call 20%");
        socket.to(users[0]).emit('createOffer');
    }

    socket.on('candidate', candidate =>{
        console.log("loading candidate");
        console.log(candidate);
        socket.to(users[1]).emit('candidate', candidate);
    })
    
    
    socket.on('sendOffer', offer => {
        console.log("Starting call 50%");
        socket.to(users[1]).emit('recieveOffer', offer);
    })
    
    socket.on('sendAnswer', answer => {
        console.log("Starting call 90%");
        socket.to(users[0]).emit('recieveAnswer', answer);
    })

    socket.on('disconnect' , () =>{

        users.splice(users.indexOf(socket.id), 1);
        console.log("user removed");
        console.log(users);
    })
})



// app.use(express.static(path.join(__dirname, "public")));

app.get('/home', (req, res) => {
    res.sendFile(__dirname, + '/public/index.html');
})
app.use(express.static(path.resolve('./public')));






server.listen(PORT, () => {
        console.log("Server Started at port " + PORT);
    })



// const express = require('express');
// const path = require('path');
// const http = require('http');



// const app = express();

// const server = http.createServer(app);
// const PORT = process.env.PORT || 8000;


// const { Server: SocketIO } = require('socket.io');

// const io = new SocketIO(server);


// const users = [];



// io.on('connection', socket => {
//     console.log('user connected ' + socket.id);
//     if (users.length < 2) users.push(socket.id);
//     else console.log("room full");

//     if (users.length >= 2) {
//         console.log("Starting call 20%");
//         socket.to(users[0]).emit('createOffer');
//     }
    
    
//     socket.on('sendOffer', offer => {
//         console.log("Starting call 50%");
//         socket.to(users[1]).emit('recieveOffer', offer);
//     })
    
//     socket.on('sendAnswer', answer => {
//         console.log("Starting call 90%");
//         socket.to(users[0]).emit('recieveAnswer', answer);
//     })

//     socket.on('disconnect' , () =>{

//         users.splice(users.indexOf(socket.id), 1);
//         console.log("user removed");
//         console.log(users);
//     })
// })



// // app.use(express.static(path.join(__dirname, "public")));

// app.get('/home', (req, res) => {
//     res.sendFile(__dirname, + '/public/index.html');
// })
// app.use(express.static(path.resolve('./public')));






// server.listen(PORT, () => {
//         console.log("Server Started at port " + PORT);
//     })
