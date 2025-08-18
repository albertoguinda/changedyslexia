import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { BarChartGradientComponent } from '../../../shared/components/charts/bar-chart-gradient.component';
import { LineChartPulseComponent } from '../../../shared/components/charts/line-chart-pulse.component';
import { DonutChartComponent } from '../../../shared/components/charts/donut-chart.component';
import { StatsCardsComponent } from '../../../shared/components/stats-cards.component';
import { QuickActionsComponent } from '../../../shared/components/quick-actions.component';
import { ActivityFeedComponent } from '../../../shared/components/activity-feed.component';
import { ProgressRingsComponent } from '../../../shared/components/progress-rings.component';
import { InsightsComponent } from '../../../shared/components/insights.component';

@Component({
  selector: 'app-overview',
  imports: [
    CommonModule, 
    BarChartGradientComponent, 
    LineChartPulseComponent, 
    DonutChartComponent, 
    StatsCardsComponent, 
    QuickActionsComponent,
    ActivityFeedComponent,
    ProgressRingsComponent,
    InsightsComponent
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class OverviewComponent {
  constructor(private authService: AuthService) {}

  logout() { this.authService.logout(); }
  get currentUser() { return this.authService.getCurrentUser(); }
}
