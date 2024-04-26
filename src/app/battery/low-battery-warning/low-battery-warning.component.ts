import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-low-battery-warning',
  standalone: true,
  imports: [],
  templateUrl: './low-battery-warning.component.html',
  styleUrl: './low-battery-warning.component.css'
})
export class LowBatteryWarningComponent {
  @Input() warningMessage : string = ''
  @Input() display : string = ''
}
