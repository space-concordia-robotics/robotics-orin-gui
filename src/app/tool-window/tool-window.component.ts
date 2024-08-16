import {Component, EventEmitter, Output} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tool-window',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatCheckbox,
    FormsModule
  ],
  templateUrl: './tool-window.component.html',
  styleUrl: './tool-window.component.css'
})
export class ToolWindowComponent {

  onMapChanged(event : any){
    this.mapChecked.emit(event.checked)
  }

  onCameraStreamsChanged(event : any){
    this.cameraStreamsChecked.emit(event.checked)
  }
  
  onBatteryStatusChanged(event : any) {
    this.batteryStatusChecked.emit(event.checked)
  }

  onAutonomyStatusChanged(event : any) {
    this.autonomyStatusChecked.emit(event.checked);
  }

  onArDisplayChanged(event : any) {
    this.arDisplayChecked.emit(event.checked)
  }

  @Output() mapChecked = new EventEmitter<boolean>()
  @Output() cameraStreamsChecked = new EventEmitter<boolean>()
  @Output() batteryStatusChecked = new EventEmitter<boolean>()
  @Output() autonomyStatusChecked = new EventEmitter<boolean>()
  @Output() arDisplayChecked = new EventEmitter<boolean>()
}
