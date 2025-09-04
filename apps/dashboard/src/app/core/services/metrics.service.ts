import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { switchMap, shareReplay, map } from 'rxjs/operators';
import { ApiService } from './api';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private metricsSubject = new BehaviorSubject<any>(null);
  private skillsSubject = new BehaviorSubject<any>(null);

  // Observables públicos
  metrics$ = this.metricsSubject.asObservable();
  skills$ = this.skillsSubject.asObservable();

  // Auto-refresh cada 5 minutos
  private autoRefresh$ = timer(0, 300000).pipe(
    switchMap(() => this.loadMetrics()),
    shareReplay(1)
  );

  constructor(private apiService: ApiService) {
    // Iniciar auto-refresh
    this.autoRefresh$.subscribe();
  }

  loadMetrics(): Observable<any> {
    return new Observable(observer => {
      // Cargar métricas del dashboard
      this.apiService.getDashboardMetrics().subscribe({
        next: (data) => {
          // Mapear la estructura de la API al formato que espera el dashboard
          const mappedData = this.mapApiResponseToDashboard(data);
          this.metricsSubject.next(mappedData);
          observer.next(mappedData);
        },
        error: (error) => {
          console.error('Error loading dashboard metrics:', error);
          observer.error(error);
        }
      });

      // Cargar métricas de habilidades
      this.apiService.getSkillsMetrics().subscribe({
        next: (data) => {
          this.skillsSubject.next(data);
        },
        error: (error) => {
          console.error('Error loading skills metrics:', error);
        }
      });
    });
  }

  private mapApiResponseToDashboard(apiData: any): any {
    return {
      // Mapear 'basic' a 'stats' que es lo que espera el template
      stats: {
        totalSessions: apiData.basic?.totalSessions || 0,
        todaySessions: apiData.basic?.todaySessions || 0,
        averageScore: apiData.basic?.averageScore || 0,
        averageAccuracy: apiData.basic?.averageAccuracy || 0
      },
      // Mantener devices tal como está
      devices: apiData.devices || {},
      // Mantener games
      games: apiData.games || [],
      // Mantener progress
      progress: apiData.progress || [],
      // Mantener dyslexia metrics
      dyslexia: apiData.dyslexia || {},
      // Mantener period info
      period: apiData.period || {}
    };
  }

  refreshMetrics(): void {
    this.loadMetrics().subscribe();
  }

  getCurrentMetrics(): any {
    return this.metricsSubject.value;
  }

  getCurrentSkills(): any {
    return this.skillsSubject.value;
  }
}
