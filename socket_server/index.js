const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
// React(3000번 포트)에서 오는 요청을 허용한다는 설정
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`유저 접속함: ${socket.id}`);

  // [핵심] 클라이언트가 'send_progress'라고 외치면 듣는 부분
  socket.on("send_progress", (data) => {
    // 나를 포함한 모든 사람에게(broadcast) 'receive_progress'라고 외쳐줌
    io.emit("receive_progress", data);
  });
});

server.listen(3001, () => {
  console.log("서버가 3001번 포트에서 실행 중");
});