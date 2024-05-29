import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';

@Component({
  selector: 'app-estop-button',
  standalone: true,
  imports: [],
  templateUrl: './estop-button.component.html',
  styleUrl: './estop-button.component.css'
})
export class EstopButtonComponent {

  constructor(private http: HttpClient) {}

  private baseUrl = 'https://127.0.0.1:5000';

  sendEstopRequest() {
    this.http.get(`${this.baseUrl}/estop`).subscribe(
      response => {
        console.log("Estop executed succesfully", response);
      },
      error => {
        console.error("Error executing estop", error);
      }

    )
  }

}
