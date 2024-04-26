import { Component, OnInit } from '@angular/core';
import { BatteryInfoComponent } from '../battery-info/battery-info.component';
import { RosService } from '../../services/ros.service';
import { LowBatteryWarningComponent } from '../low-battery-warning/low-battery-warning.component';

@Component({
  selector: 'app-battery-status-window',
  standalone: true,
  imports: [BatteryInfoComponent, LowBatteryWarningComponent],
  templateUrl: './battery-status-window.component.html',
  styleUrl: './battery-status-window.component.css',
})
export class BatteryStatusWindowComponent implements OnInit {
  leftBatteryVoltage: number;
  rightBatteryVoltage: number;
  

  constructor(private rosService: RosService) {
    this.leftBatteryVoltage = 0; // Initial value
    this.rightBatteryVoltage = 0; // Initial value
  }

  ngOnInit(): void {
    // Subscribe to the left battery voltage topic
    this.rosService.subscribeToLeftBatteryVoltage((data: number) => {
      this.leftBatteryVoltage = data;
    });

    // Subscribe to the right battery voltage topic
    this.rosService.subscribeToRightBatteryVoltage((data: number) => {
      this.rightBatteryVoltage = data;
    });
  }

  displayWarning(): string {
    if (this.leftBatteryVoltage <= 13.5 || this.rightBatteryVoltage <= 13.5) {
      return 'flex'
    } else {
      return 'none'
    }
  }

  warningMessage(): string {
    if (this.leftBatteryVoltage <= 13.5 && this.rightBatteryVoltage <= 13.5) {
      return 'Both batteries are low!'
    } else if (this.leftBatteryVoltage <= 13.5 ) {
      return 'Battery L is low!'
    } else if (this.rightBatteryVoltage <= 13.5 ) {
      return 'Battery R is low!'     
    } else {
      return ''
    }
  }
}