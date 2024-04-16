import { Component } from '@angular/core';
import {MapsComponent} from "../maps/maps.component";
import {NgIf} from "@angular/common";
import {ToolWindowComponent} from "../tool-window/tool-window.component";
import {VideoClientComponent} from "../video-client/video-client.component";
import {ResizableComponent} from "../resizable/resizable.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MapsComponent,
    NgIf,
    ToolWindowComponent,
    VideoClientComponent,
    ResizableComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
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

  protected readonly VideoClientComponent = VideoClientComponent;
  protected readonly MapsComponent = MapsComponent;
}
