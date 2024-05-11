import { Component, OnInit } from '@angular/core';
import { BatteryInfoComponent } from '../battery-info/battery-info.component';
import { RosService } from '../../services/ros.service';
import { LowBatteryWarningComponent } from '../low-battery-warning/low-battery-warning.component';
import { WarningMessageService } from '../../services/warning-message.service';

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
  

  constructor(private rosService: RosService, private warningService: WarningMessageService) {
    this.leftBatteryVoltage = 0; // Initial value
    this.rightBatteryVoltage = 0; // Initial value
  }

  ngOnInit(): void {
    // Subscribe to the left battery voltage topic, update the value and check if a warning needs to be displayed
    this.rosService.subscribeToLeftBatteryVoltage((data: number) => {
      this.leftBatteryVoltage = data;
      this.checkWarning();
    });

    // Subscribe to the right battery voltage topic, update the value and check if a warning needs to be displayed
    this.rosService.subscribeToRightBatteryVoltage((data: number) => {
      this.rightBatteryVoltage = data;
      this.checkWarning();
    });
  }

  // Check for warnings and call displayWarning with appropriate arguments
  checkWarning(): void {
    if (this.leftBatteryVoltage <= 13.5 && this.rightBatteryVoltage <= 13.5) {
      this.displayWarning('Both batteries are low!', true);
    } else if (this.leftBatteryVoltage <= 13.5 ) {
      this.displayWarning('Battery L is low!', true);
    } else if (this.rightBatteryVoltage <= 13.5 ) {
      this.displayWarning('Battery R is low!' , true);    
    } else {
      this.displayWarning('', false);
    }
  }

  // Sets the given warning message and warning component visibility
  displayWarning(warningMessage : string, warningVisibility : boolean): void {
    this.warningService.setWarningMessage(warningMessage);
    this.warningService.setWarningVisibility(warningVisibility);
  }
}