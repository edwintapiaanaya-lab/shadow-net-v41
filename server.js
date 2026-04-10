const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// CONFIGURACIÓN DE SEGURIDAD - PUERTA ABIERTA
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

let nodes = [];

io.on('connection', (socket) => {
  console.log('Nuevo nodo conectado');

  socket.on('node_entry', (data) => {
    if (data && data.id && !nodes.includes(data.id)) {
      nodes.push(data.id);
    }
    io.emit('update_network', {
      total: nodes.length,
      nodes: nodes
    });
  });

  socket.on('disconnect', () => {
    // El nodo se desconecta pero mantenemos el conteo para la prueba
  });
});

// PUERTO DE RENDER
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Servidor activo en puerto: ' + PORT);
});
