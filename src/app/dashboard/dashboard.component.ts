import { Component } from '@angular/core';
import {MapsComponent} from "../maps/maps.component";
import {NgIf} from "@angular/common";
import {ToolWindowComponent} from "../tool-window/tool-window.component";
import {VideoClientComponent} from "../video-client/video-client.component";
import {ResizableComponent} from "../resizable/resizable.component";
import { BatteryStatusWindowComponent } from '../battery/battery-status-window/battery-status-window.component';
import { AutonomyStatusComponent } from '../autonomy-status/autonomy-status.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MapsComponent,
    NgIf,
    ToolWindowComponent,
    VideoClientComponent,
    ResizableComponent,
    BatteryStatusWindowComponent,
    AutonomyStatusComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  mapVisible : boolean
  camerasVisible : boolean
  batteryStatusVisible : boolean
  autonomyStatusVisible : boolean
  constructor() {
  }
  setMapVisibility(event:boolean){
    this.mapVisible = event
  }
  setCameraVisibility(event:boolean){
    this.camerasVisible = event
  }
  setBatteryStatusVisibility(event:boolean){
    this.batteryStatusVisible = event
  }
  setAutonomyStatusVisible(event:boolean){
    this.autonomyStatusVisible = event
  }

  protected readonly VideoClientComponent = VideoClientComponent;
  protected readonly MapsComponent = MapsComponent;
  protected readonly BatteryStatusWindowComponent = BatteryStatusWindowComponent;
  protected readonly AutonomyStatusComponent = AutonomyStatusComponent
}
