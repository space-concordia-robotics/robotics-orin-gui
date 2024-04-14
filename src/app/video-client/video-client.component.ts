import { Component } from '@angular/core';
import * as io from "socket.io-client";


const config = {
  iceServers: [
      {"urls": "stun:stun.l.google.com:19302",},
  ]
};
@Component({
  selector: 'app-video-client',
  standalone: true,
  imports: [],
  templateUrl: './video-client.component.html',
  styleUrl: './video-client.component.css'
})
export class VideoClientComponent {

  peerConnection : RTCPeerConnection
  socket = io.connect("https://localhost:5000");
  constructor() {

    this.socket.on("offer", (id, description) => {


    console.log('Got offer back from video-server for ', id, description)

      this.peerConnection = new RTCPeerConnection(config);

    this.peerConnection
      .setRemoteDescription(description)
      .then(() => this.peerConnection.createAnswer())
      .then(sdp => this.peerConnection.setLocalDescription(sdp))
      .then(() => {
        this.socket.emit("answer", id, this.peerConnection.localDescription);
        console.log('Send answer to video-server', this.peerConnection.localDescription)
      });

    this.peerConnection.ontrack = event => {
      console.log('Got video for video-client...',event.streams[0])
      let video = document.getElementById("client-video") as HTMLVideoElement
      video.srcObject = event.streams[0];
    };

    this.peerConnection.onicecandidate = event => {
    if (event.candidate) {
      this.socket.emit("candidate", id, event.candidate);
    }
  };
});


this.socket.on("candidate", (id, candidate) => {
  this.peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

  this.socket.on("connect", () => {
    console.log('Watcher event fired...')
    this.socket.emit("watcher");
  });

  this.socket.on("broadcaster", () => {
    this.socket.emit("watcher");
  });
  }
}
