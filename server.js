const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// CONFIGURACIÓN DE SEGURIDAD (CORS) - PUERTA ABIERTA
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

let nodes = [];

io.on('connection', (socket) => {
  console.log('Nuevo nodo conectado:', socket.id);

  socket.on('node_entry', (data) => {
    // Si el ID no está en la lista, lo agregamos
    if (!nodes.includes(data.id)) {
      nodes.push(data.id);
    }
    // Avisamos a todos que hay un nuevo total
    io.emit('update_network', {
      total: nodes.length,
      nodes: nodes
    });
  });

  socket.on('disconnect', () => {
    // Aquí podrías quitar nodos de la lista si quieres que el número baje al cerrar pestañas
  });
});

// EL PUERTO QUE USA RENDER
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  // CORRECCIÓN DE COMILLAS INCLINADAS AQUÍ:
  console.log(Servidor corriendo en puerto ${PORT});
});
