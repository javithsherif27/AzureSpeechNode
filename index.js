const app = require('express')();
const initDB = require('./db').initDB;
const {  convertAudio } = require('./SpeechRecognition');

// initDB();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message',  (message) => {
    console.log('Message Received ::: Transaction Id -> '+ message.transactionId);
   convertAudio(message,io);
 
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));

