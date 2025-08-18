import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div *ngFor="let stat of stats" class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-base-content/60 uppercase tracking-wide">{{stat.label}}</p>
              <p class="text-2xl font-bold" [ngClass]="stat.colorClass">{{stat.value}}</p>
              <p class="text-xs" [ngClass]="stat.trend > 0 ? 'text-success' : 'text-error'">
                <span>{{stat.trend > 0 ? '‚Üó' : '‚Üò'}} {{Math.abs(stat.trend)}}% vs {{stat.period}}</span>
              </p>
            </div>
            <div class="text-3xl opacity-70">{{stat.icon}}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StatsCardsComponent {
  Math = Math;
  
  stats = [
    {
      label: 'Sesiones Hoy',
      value: '6',
      trend: +15,
      period: 'ayer',
      icon: 'ÌæØ',
      colorClass: 'text-primary'
    },
    {
      label: 'Tiempo Total',
      value: '2h 15m',
      trend: +8,
      period: 'semana',
      icon: '‚è±Ô∏è',
      colorClass: 'text-secondary'
    },
    {
      label: 'Precisi√≥n',
      value: '87%',
      trend: +12,
      period: 'mes',
      icon: 'ÌæØ',
      colorClass: 'text-accent'
    },
    {
      label: 'Racha D√≠as',
      value: '9',
      trend: +3,
      period: 'r√©cord',
      icon: 'Ì¥•',
      colorClass: 'text-warning'
    }
  ];
}
