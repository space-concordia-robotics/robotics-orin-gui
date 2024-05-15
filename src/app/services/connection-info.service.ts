import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionInfoService {

  private baseUrl = 'https://localhost:5000';

  constructor(private http: HttpClient) { }

  getServerURL(): Promise<any> {
    return fetch(`${this.baseUrl}/api/serverURL`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching server URL:', error);
        throw error;
      });
  }
}
