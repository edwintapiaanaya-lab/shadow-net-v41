const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// ESTO ES LO QUE TIENES QUE CAMBIAR:
const io = new Server(server, {
  cors: {
    origin: "*", // Esto permite que 4everland se conecte
    methods: ["GET", "POST"]
  }
});

let nodes = [];

io.on('connection', (socket) => {
  console.log('Nuevo nodo conectado:', socket.id);

  socket.on('node_entry', (data) => {
    if (!nodes.includes(data.id)) {
      nodes.push(data.id);
    }
    io.emit('update_network', {
      total: nodes.length,
      nodes: nodes
    });
  });

  socket.on('disconnect', () => {
    // Aquí puedes limpiar la lista si quieres
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(Servidor corriendo en puerto ${PORT});
});
