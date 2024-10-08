import express, { Application } from "express";
// import { createServer, Server as HTTPServer } from "http";

import { createServer, Server as HTTPSServer } from "https";

import { Server, Socket } from "socket.io";
import { getFrontEndURL, getServerHost, getServerURL } from "../config/connection_info";
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path'

const cors = require("cors")

export class AppServer {
  private httpServer: HTTPSServer;
  private app: Application;
  private io: Server;
  private broadcaster : string;
  private activeSockets: string[] = [];

  private readonly DEFAULT_PORT = 5000;
  private readonly DEFAULT_HOST = getServerHost();
  private readonly DEFAULT_FRONT_END_HOST = getFrontEndURL();

  constructor() {
    this.initialize();
    this.handleRoutes();
  }

  private configureApp(): void {
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(cors())
  }

  private initialize(): void {
    this.app = express();
    this.app.use(cors())

    this.httpServer = createServer(
      {
        "key" : fs.readFileSync("./ssl/key.pem"),
        "cert" : fs.readFileSync("./ssl/cert.pem"),
      },
      this.app);

    this.io = require('socket.io')(this.httpServer, {
        cors: {
            origin: '*',
            // origin: `${this.DEFAULT_FRONT_END_HOST}`,
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

    this.app.get('/aruco_generate_marker/:id', (req, res) => {
      const tagId = req.params.id

      exec(`python3 scripts/python/aruco_generate_marker.py --id ${tagId}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          res.status(500).send('Error generating AR tag');
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          res.status(500).send('Exception occured while generating AR tag')
        } else {
          console.log(`stdout: ${stdout}`);
          const imagePath = stdout.trim();
          res.json({ imagePath });
        }
      });
    })

    this.app.get("/api/serverURL", (req, res) => {
      const serverURL = `${this.DEFAULT_HOST}:${this.DEFAULT_PORT}`
      res.json(serverURL);
    })
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
  console.log(`Server is listening on ${host}:${port}`);
});


