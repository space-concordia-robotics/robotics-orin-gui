import express, { Application } from "express";
// import { createServer, Server as HTTPServer } from "http";

import { createServer, Server as HTTPSServer } from "https";

import { Server, Socket } from "socket.io";

import fs from 'fs';


export class AppServer {
 private httpServer: HTTPSServer;
 private app: Application;
 private io: Server;
 private broadcaster : string;
 private activeSockets: string[] = [];

 private readonly DEFAULT_PORT = 5000;
 // private readonly DEFAULT_HOST = "192.168.0.101";
 private readonly DEFAULT_HOST = "localhost";
 constructor() {
   this.initialize();
   this.handleRoutes();
 }

 private configureApp(): void {
    this.app.use(express.static("public"));
  }

 private initialize(): void {
    this.app = express();

    this.httpServer = createServer(
      {
        "key" : fs.readFileSync("./ssl/key.pem"),
        "cert" : fs.readFileSync("./ssl/cert.pem"),
      },
      this.app);

    this.io = require('socket.io')(this.httpServer, {
        cors: {
            // origin: "https://192.168.0.101:4200",
            origin: `https://${this.DEFAULT_HOST}:4200`,
            methods: ["GET", "POST"],
            transports: ['websocket', 'polling'],
            credentials: true
        },
        allowEIO3: true
    });
    this.configureApp();
    this.handleSocketConnection();
 }

 private handleRoutes(): void {
   this.app.get("/", (req, res) => {
     res.send(`<h1>Hello World</h1>`);
   });
 }

 private handleSocketConnection(): void {
    this.io.on("connection", socket => {
      const existingSocket = this.activeSockets.find(
        existingSocket => existingSocket === socket.id
      );
      if (!existingSocket) {
        this.activeSockets.push(socket.id);
        console.log(this.activeSockets);
      }
      socket.on("broadcaster", () => {
        this.broadcaster = socket.id;
        socket.broadcast.emit("broadcaster");
      });
      socket.on("watcher", () => {
        console.log('Got watcher...')
        socket.to(this.broadcaster).emit("watcher", socket.id);
      });
      socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
      });
      socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
      });
      socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
      });
      socket.on("disconnect", () => {
        socket.to(this.broadcaster).emit("disconnectPeer", socket.id);
      });
    });
  }

 public listen(callback: (host : string, port: number) => void): void {
   this.httpServer.listen(this.DEFAULT_PORT, () =>
     callback(this.DEFAULT_HOST,this.DEFAULT_PORT)
   );
 }
}
const server = new AppServer();
server.listen((host,port) => {
  console.log(`Server is listening on https://${host}:${port}`);
});

