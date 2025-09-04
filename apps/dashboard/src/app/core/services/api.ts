import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getDashboardMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metrics/dashboard`);
  }

  getSkillsMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metrics/skills`);
  }
}
