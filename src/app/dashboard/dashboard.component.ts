import { Component } from '@angular/core';
import {MapsComponent} from "../maps/maps.component";
import {NgForOf, NgIf} from "@angular/common";
import {ToolWindowComponent} from "../tool-window/tool-window.component";
import {VideoClientComponent} from "../video-client/video-client.component";
import {ResizableComponent} from "../resizable/resizable.component";
import { BatteryStatusWindowComponent } from '../battery/battery-status-window/battery-status-window.component';
import { AutonomyStatusComponent } from '../autonomy-status/autonomy-status.component';
import { WarningComponent } from '../warning/warning.component';
import { ArDisplayComponent } from '../ar-ui/ar-display/ar-display.component';

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
    WarningComponent,
    ArDisplayComponent,
    NgForOf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  mapVisible : boolean
  camerasVisible : boolean
  batteryStatusVisible : boolean
  autonomyStatusVisible : boolean
  arDisplayVisible : boolean
  
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

  setArDisplayVisible(event:boolean){
    this.arDisplayVisible = event
  }

  protected readonly VideoClientComponent = VideoClientComponent;
  protected readonly MapsComponent = MapsComponent;
  protected readonly BatteryStatusWindowComponent = BatteryStatusWindowComponent;
  protected readonly AutonomyStatusComponent = AutonomyStatusComponent;
  protected readonly ArDisplayComponent = ArDisplayComponent;
}
