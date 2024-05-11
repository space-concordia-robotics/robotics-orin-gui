import { Component, Input } from '@angular/core';
import { WarningMessageService } from '../services/warning-message.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-warning',
  standalone: true,
  imports: [NgIf],
  templateUrl: './warning.component.html',
  styleUrl: './warning.component.css'
})
export class WarningComponent {
  warningMessage: string = '';
  warningVisibility: boolean = false;

  constructor(private warningService: WarningMessageService) { }

  ngOnInit(): void {
    this.warningService.getWarningMessage().subscribe(message => {
      this.warningMessage = message;
    });
    
    this.warningService.getWarningVisibility().subscribe(visibility => {
      this.warningVisibility = visibility;
    });
  }
}