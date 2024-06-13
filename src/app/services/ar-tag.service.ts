import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArTagService {
  private baseUrl = 'https://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  generateArucoTag(id: number): Observable<{ imagePath: string }> {
    return this.http.get<{ imagePath: string }>(`${this.baseUrl}/aruco_generate_marker/${id}`);
  }
}
