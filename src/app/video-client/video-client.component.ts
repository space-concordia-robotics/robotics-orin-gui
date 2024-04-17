import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import * as io from "socket.io-client";
import {DecimalPipe} from "@angular/common";

import {getServerURL} from "../../../config/connection_info";

const config = {
  iceServers: [
      {"urls": "stun:stun.l.google.com:19302",},
  ]
};
@Component({
  selector: 'app-video-client',
  standalone: true,
    imports: [
        DecimalPipe
    ],
  templateUrl: './video-client.component.html',
  styleUrl: './video-client.component.css'
})
export class VideoClientComponent implements OnInit{


  peerConnection : RTCPeerConnection

  socket = io.connect(getServerURL());
  constructor() {
    console.log(`Client listening to server ${getServerURL()}`)
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

      console.log('Recieved stream from server' , event.receiver.track, event.transceiver.mid)
      // console.log(event.receiver)
      let videoSource = new MediaStream([event.receiver.track]);
      console.log('Adding new video source : ' , videoSource)

      let video = document.getElementById(`video-${event.transceiver.mid}`) as HTMLVideoElement
      // let video = document.getElementById(`video-0`) as HTMLVideoElement
      video.srcObject = videoSource
      
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
  window.onunload = window.onbeforeunload = () => {
      this.socket.close();
    };
  }
  ngOnInit(): void {
  }
}
