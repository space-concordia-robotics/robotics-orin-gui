import {Component, NgZone} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ROSLIB_Service} from "./services/roslibjs-service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = "Robotics GUI"

  constructor() {
  }
}
