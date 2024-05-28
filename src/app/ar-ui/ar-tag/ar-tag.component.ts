import { Component, Input } from '@angular/core';
import { ArucoTag } from '../../interfaces/aruco-tag';
import { NgForOf } from '@angular/common';


@Component({
  selector: 'app-ar-tag',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './ar-tag.component.html',
  styleUrl: './ar-tag.component.css'
})
export class ArTagComponent {
  @Input() tag : ArucoTag
}
