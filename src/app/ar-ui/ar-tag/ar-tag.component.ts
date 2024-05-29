import { Component, Input } from '@angular/core';
import { ArucoTag } from '../../interfaces/aruco-tag';
import { NgForOf, NgIf } from '@angular/common';
import { ArTagService } from '../../services/ar-tag.service';

@Component({
  selector: 'app-ar-tag',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './ar-tag.component.html',
  styleUrl: './ar-tag.component.css',
})
export class ArTagComponent {
  @Input() tag : ArucoTag
  image_path : string

  constructor(private arTagService : ArTagService) {}

  ngOnInit() {
    this.arTagService.generateArucoTag(this.tag.id).subscribe(res => {
      this.image_path = res.imagePath;
    })
  }
}
