import {Component, NgZone} from '@angular/core';
import * as io from "socket.io-client";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {getServerURL} from "../../../config/connection_info";


const config = {
  iceServers: [
      {"urls": "stun:stun.l.google.com:19302",},
  ]
};
@Component({
  selector: 'app-video-server',
  standalone: true,
  imports: [],
  templateUrl: './video-server.component.html',
  styleUrl: './video-server.component.css'
})
export class VideoServerComponent {

  peerConnections: Map<string, RTCPeerConnection> = new Map()
  socket = io.connect(getServerURL());
  mediaStream: MediaStream

  streamMediaDevice(device : MediaDeviceInfo) {
    console.log(`Starting stream for ${device.label} - ${device.deviceId}`)
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: {exact: device.deviceId}
      }
    }).then(stream => {
      this.mediaStream = stream;
      // let v = document.getElementById('server-video') as HTMLVideoElement
      // v.srcObject = stream
      this.socket.emit("broadcaster");
    })
  }

  enumerateMediaDevices() {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
          if (device.kind === "videoinput") {
          this.streamMediaDevice(device)
          }
        });
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  }

  attachSocketEvents(){
    this.socket.on("answer", (id, description) => {
      console.log('Server got answer for', description)
      this.peerConnections.get(id)?.setRemoteDescription(description);
    });

    this.socket.on("watcher", id => {

      const peerConnection = new RTCPeerConnection(config);
      this.peerConnections.set(id, peerConnection);

      console.log('Got video-client ', peerConnection)
      this.mediaStream!!.getTracks().forEach(track => peerConnection.addTrack(track, this.mediaStream));

      console.log('Adding media stream', this.mediaStream)
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          this.socket.emit("candidate", id, event.candidate);
        }
      };
      peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          console.log('Server sending offer', peerConnection.localDescription)
          this.socket.emit("offer", id, peerConnection.localDescription);
        });
      });

    this.socket.on("candidate", (id, candidate) => {
      this.peerConnections.get(id)?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.socket.on("disconnectPeer", id => {
      this.peerConnections.get(id)?.close();
      // delete this.peerConnections.get();
      this.peerConnections.delete(id)
    });
    window.onunload = window.onbeforeunload = () => {
      this.socket.close();
    };
  }
  constructor() {
    this.attachSocketEvents()
    this.enumerateMediaDevices()
  }
}
