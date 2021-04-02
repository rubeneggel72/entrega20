const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const uuid = require('uuid');
const getDateTime = require('./util/fecha-hora.js')
const create = require("./perdurarMensajes");
const productoRouter = require('./routes/productos');
const mensajeRouter = require('./routes/mensajes');
const mongoose = require('mongoose');
const Producto = require('./models/productos');
mongoose.connect('mongodb://127.0.0.1/ecommerce', { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const server = app.listen(process.env.PORT || 8080);
const io = require("socket.io")(server);


global.administrador = true;
let users = [];
let connnections = [];

//Carga en arrayProductos para enviar lista producto por socket
global.arrayProductos = [];


//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./public'));
app.use("/mensajes", mensajeRouter);
app.use("/productos", productoRouter);
app.use('/', router);

//listen conección socket 
io.on('connection', (socket) => {
    console.log('New user connected');
    connnections.push(socket)
    socket.username = 'Anonymous';

    //broadcast productos 
    setInterval(function () {

        Producto.find(function (error, items) {

            if (error) {
                response.status(500).send(error);
                return;
            }

            console.log(items);


            arrayProductos = items;
        })
        socket.broadcast.emit('arrayProductos', arrayProductos);
    }, 3000);

    //listen  change_username
    socket.on('change_username', data => {
        let id = uuid.v4();
        socket.id = id;
        socket.username = data.nickName;
        users.push({ id, username: socket.username, color: socket.color });
        updateUsernames();
    })

    //update Usernames en cliente
    const updateUsernames = () => {
        io.sockets.emit('get users', users);
    }

    //listen nuevo mensaje
    socket.on('new_message', (data) => {

        //broadcast nuevo mensaje
        const messageEmit = { message: data.message, username: socket.username, date: getDateTime() }
        const obj = { message: data.message, username: socket.username }
        console.log(messageEmit);
        create(obj);
        io.sockets.emit('new_message', messageEmit);
    })

    //listen tipeo en chat
    socket.on('typing', data => {
        socket.broadcast.emit('typing', { username: socket.username });
    })

    //Desconeccion de usuario
    socket.on('disconnect', data => {
        if (!socket.username)
            return;
        //encontrar usuario y borrarlo de la lista de conectados
        let user = undefined;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                user = users[i];
                break;
            }
        }
        users = users.filter(x => x !== user);

        //actualiza lista usuarios conectados
        updateUsernames();
        connnections.splice(connnections.indexOf(socket), 1);
    })
})