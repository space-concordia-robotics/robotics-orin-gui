import {Component, NgZone} from '@angular/core';
import * as io from "socket.io-client";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";


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

  videoElement = document.getElementById('video') as HTMLVideoElement

  peerConnections : Map<string,RTCPeerConnection> = new Map()
  socket = io.connect("https://localhost:5000");
  mediaStream : MediaStream
  constructor(private zone: NgZone) {

      this.socket.on("answer", (id, description) => {
        console.log('Server got answer for',description)
        this.peerConnections.get(id)?.setRemoteDescription(description);
      });

      this.socket.on("watcher", id => {

        const peerConnection = new RTCPeerConnection(config);
        this.peerConnections.set(id,peerConnection);

        console.log('Got video-client ', peerConnection)
        //
        this.mediaStream!!.getTracks().forEach(track => peerConnection.addTrack(track, this.mediaStream));
        //
        console.log('Adding media stream',this.mediaStream)
        peerConnection.onicecandidate = event => {
          if (event.candidate) {
            this.socket.emit("candidate", id, event.candidate);
          }
        };
        //
        peerConnection
          .createOffer()
          .then(sdp => peerConnection.setLocalDescription(sdp))
          .then(() => {
            console.log('Server sending offer',peerConnection.localDescription)
            this.socket.emit("offer", id, peerConnection.localDescription);
          });
      })  ;

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
        let constraints = {
          video: true
        }

        this.zone.runOutsideAngular(() => {
          navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
              console.log('Stream is ', stream)
              this.socket.emit("broadcaster");
              this.mediaStream = stream
            })
            .catch(err => console.error(err));
        });


    }

//     gotDevices(deviceInfos) {
//       window.deviceInfos = deviceInfos;
//       for (const deviceInfo of deviceInfos) {
//       const option = document.createElement("option");
//       option.value = deviceInfo.deviceId;
//       if (deviceInfo.kind === "audioinput") {
//         option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
//         audioSelect.appendChild(option);
//       } else if (deviceInfo.kind === "videoinput") {
//         option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
//         videoSelect.appendChild(option);
//       }
//   }
// }

}

