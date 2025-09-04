import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { MetricsService } from '../../../core/services/metrics.service';

// Import only used chart components
import { BarChartGradientComponent } from '../../../shared/components/charts/bar-chart-gradient.component';
import { LineChartPulseComponent } from '../../../shared/components/charts/line-chart-pulse.component';
import { DonutChartComponent } from '../../../shared/components/charts/donut-chart.component';
import { StatsCardsComponent } from '../../../shared/components/stats-cards.component';
import { QuickActionsComponent } from '../../../shared/components/quick-actions.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    BarChartGradientComponent,
    LineChartPulseComponent,
    DonutChartComponent,
    StatsCardsComponent,
    QuickActionsComponent
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  dashboardData: any = null;
  skillsData: any = null;
  isLoading = true;
  error: string | null = null;
  lastUpdated: Date = new Date();

  constructor(
    private authService: AuthService,
    private metricsService: MetricsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData() {
    this.isLoading = true;
    this.error = null;

    combineLatest([
      this.metricsService.metrics$,
      this.metricsService.skills$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([metrics, skills]) => {
        if (metrics) {
          this.dashboardData = metrics;
          this.isLoading = false;
          this.lastUpdated = new Date();
        }

        if (skills) {
          this.skillsData = skills;
        }

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Error al cargar los datos del dashboard';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private setupAutoRefresh() {
    this.metricsService.loadMetrics().subscribe();
  }

  onRefresh() {
    this.metricsService.refreshMetrics();
    this.lastUpdated = new Date();
  }

  logout() {
    this.authService.logout();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get formattedLastUpdated(): string {
    return this.lastUpdated.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
