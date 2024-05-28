import { Component } from '@angular/core';
import { RosService } from '../../services/ros.service';
import { ArucoMarker } from '../../interfaces/aruco-markers';
import { ArTagComponent } from '../ar-tag/ar-tag.component';
import { ArucoTag } from '../../interfaces/aruco-tag';
import ROSLIB from 'roslib';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-ar-display',
  standalone: true,
  imports: [ArTagComponent, NgForOf],
  templateUrl: './ar-display.component.html',
  styleUrl: './ar-display.component.css'
})
export class ArDisplayComponent {
  tags : ArucoTag[] = [{
    id : 1,
    pose : new ROSLIB.Pose ({
      position: new ROSLIB.Vector3({
        x: 1.0,
        y: 2.0,
        z: 0.5
      }),
      orientation: new ROSLIB.Quaternion({
        x: 10.0,
        y: 0.5,
        z: 0.0,
        w: 1.0
      })
    })
  },{
    id : 1,
    pose : new ROSLIB.Pose ({
      position: new ROSLIB.Vector3({
        x: 6.0,
        y: 2.5,
        z: 7.5
      }),
      orientation: new ROSLIB.Quaternion({
        x: 4.0,
        y: 8.0,
        z: 11.25,
        w: 1.5
      })
    })
  }]

  constructor(private rosService: RosService) {}

  ngOnInit(): void {
    this.rosService.subscribeToArucoMarkers((data: ArucoMarker) => {
      this.tags = data.marker_ids.map((id, i) => {
        return {
          id: id,
          pose: data.poses[i]
        }
      })
    });
  }
}