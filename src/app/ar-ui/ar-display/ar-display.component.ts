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
  tags : ArucoTag[] = [];

  constructor(private rosService: RosService) {}

  ngOnInit(): void {
    this.rosService.subscribeToArucoMarkers((data: ArucoMarker) => {
      const newTagIds = data.marker_ids;
      const newPoses = data.poses;

      const newTagsMap = new Map<number, ROSLIB.Pose>();
      newTagIds.forEach((id, index) => {
        newTagsMap.set(id, newPoses[index]);
      });

      // Update tags
      this.tags = this.tags.filter(tag => {
        if (newTagsMap.has(tag.id)) {
          // If it still exists, update the pose
          tag.pose = newTagsMap.get(tag.id)!;
          newTagsMap.delete(tag.id);
          return true;
        } else {
          // If it doesn't exist anymore, remove it
          return false;
        }
      });

      // Add new tags
      newTagsMap.forEach((pose, id) => {
        this.tags.push({ id, pose });
      });
    });
  }
}