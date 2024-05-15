import {Component, NgZone, OnInit} from '@angular/core';
import * as io from "socket.io-client";
import {ConnectionInfoService} from "../services/connection-info.service";
import { Socket } from 'socket.io';
import { HttpClientModule } from '@angular/common/http';


const config = {
  iceServers: [
      {"urls": "stun:stun.l.google.com:19302",},
  ]
};
@Component({
  selector: 'app-video-server',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './video-server.component.html',
  styleUrl: './video-server.component.css'
})
export class VideoServerComponent implements OnInit {

  peerConnections: Map<string, RTCPeerConnection> = new Map()
  socket: io.Socket;
  mediaStream: MediaStream[] = []

  constructor(private connectionInfoService: ConnectionInfoService) {
  }

  ngOnInit(): void {
    this.connectionInfoService.getServerURL().then(
      (data: any) => {
        const serverURL = data;
        this.socket = io.connect(serverURL);
        this.attachSocketEvents();
        this.askForPermission();
      },
      (error: any) => {
        console.error('Error fetching server URL:', error);
      }
    );
  }

  async streamMediaDevice(device : MediaDeviceInfo) {
    console.log(`Starting stream for ${device.label} - ${device.deviceId}`)
    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: {exact: device.deviceId},
      }
    }).then(stream => {
      this.mediaStream.push(stream);
      this.socket.emit("broadcaster");
    })
  }

  askForPermission() {
    navigator.permissions.query({name: 'camera' as PermissionName}).then(PermissionStatus => {
      // If permission already granted, enumerate devices
      if (PermissionStatus.state === 'granted') {
        this.enumerateMediaDevices();
      // If permission neither granted nor denied, ask for permission
      } else if (PermissionStatus.state === 'prompt') {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
              // Permission granted
              this.enumerateMediaDevices(); 
              stream.getTracks().forEach(track => track.stop());
            })
            .catch(error => {
              console.error('Permission denied for camera:', error);
            });
      } 
      else {
        console.log('Permission denied or error occurred:', PermissionStatus.state);
      }
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
      this.mediaStream!!.forEach( (element:MediaStream) => {
        let v = document.getElementById(`server-video-1`) as HTMLVideoElement

        console.log('Adding stream to transcieer', element)
        peerConnection.addTransceiver(element.getVideoTracks()[0])
      });
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
}
