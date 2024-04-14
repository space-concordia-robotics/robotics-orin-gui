import {Component, NgZone} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import * as io from 'socket.io-client';
import {ToolWindowComponent} from "./tool-window/tool-window.component";
import {MapsComponent} from "./maps/maps.component";
import {NgIf} from "@angular/common";
import {VideoClientComponent} from "./video-client/video-client.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolWindowComponent, MapsComponent, NgIf, VideoClientComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  mapVisible : boolean
  camerasVisible : boolean
  constructor() {
  }
  setMapVisibility(event:boolean){
    this.mapVisible = event
  }
  setCameraVisibility(event:boolean){
    this.camerasVisible = event
  }
}
