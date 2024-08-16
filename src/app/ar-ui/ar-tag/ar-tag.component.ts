import { Component, Input } from '@angular/core';
import { ArucoTag } from '../../interfaces/aruco-tag';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ArTagService } from '../../services/ar-tag.service';
import { Pose } from 'roslib';

@Component({
  selector: 'app-ar-tag',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './ar-tag.component.html',
  styleUrl: './ar-tag.component.css',
})
export class ArTagComponent {
  @Input() tag : ArucoTag;
  image_path : string;
  isVisible: boolean = true;
  timer: ReturnType<typeof setTimeout>;
  previousPose: Pose;

  constructor(private arTagService : ArTagService) {}

  ngOnInit() {
    this.arTagService.generateArucoTag(this.tag.id).subscribe(res => {
      this.image_path = res.imagePath;
    })

    // Keep track of the prevoius pose to detect if the pose has not been updated for some time
    this.previousPose = this.tag.pose

    this.resetTimer();
  }

  ngDoCheck() {
    if (this.tag.pose !== this.previousPose) {
      this.previousPose = this.tag.pose
      this.resetTimer();
    }
  }

  resetTimer(): void {
    this.isVisible = true;

    // Clear timeout based on the id, if exists
    clearTimeout(this.timer);

    // Save the timeout id
    this.timer = setTimeout(() => {
      this.isVisible = false;
    }, 2000)
  }
}
