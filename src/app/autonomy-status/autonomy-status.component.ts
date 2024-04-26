import { Component } from '@angular/core';
import { RosService } from '../services/ros.service';

@Component({
  selector: 'app-autonomy-status',
  standalone: true,
  imports: [],
  templateUrl: './autonomy-status.component.html',
  styleUrl: './autonomy-status.component.css'
})
export class AutonomyStatusComponent {
  silColorHex: string;
  autonomyStatus: string;

  constructor(private rosService: RosService) {
    this.silColorHex = '#000000';
    this.autonomyStatus = '';
  }

  ngOnInit(): void {
    this.rosService.subscribeToAutonomyStatus((data: string) => {
      this.silColorHex = data;
    });
  }

  getAutonomyStatus() : string {
    if (this.silColorHex === '#FF0000') {
      return 'Autonomous Mode';
    } else if (this.silColorHex === '#00FF00') {
      return 'Reached Destination' 
    } else if (this.silColorHex === '#0000FF') {
      return 'Manual Mode' 
    } else {
      return ''
    }
  }
}
