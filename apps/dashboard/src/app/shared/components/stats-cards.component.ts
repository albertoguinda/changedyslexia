import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Sesiones de Hoy -->
      <div class="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-xl border border-primary/20">
        <div class="card-body">
          <h2 class="card-title text-primary text-sm font-medium">Sesiones Hoy</h2>
          <div class="flex items-center gap-3">
            <div class="text-3xl font-bold text-primary">{{ data?.todaySessions || 0 }}</div>
            <div class="badge" [ngClass]="getTrendBadgeClass()">
              {{ getTrendText() }}
            </div>
          </div>
          <p class="text-xs opacity-70">vs semana anterior</p>
        </div>
      </div>

      <!-- Total Sesiones -->
      <div class="card bg-gradient-to-br from-secondary/10 to-secondary/5 shadow-xl border border-secondary/20">
        <div class="card-body">
          <h2 class="card-title text-secondary text-sm font-medium">Total Sesiones</h2>
          <div class="flex items-center gap-3">
            <div class="text-3xl font-bold text-secondary">{{ data?.totalSessions || 0 }}</div>
            <div class="text-xs opacity-70">↗️ +2% vs mes</div>
          </div>
          <p class="text-xs opacity-70">Últimos 30 días</p>
        </div>
      </div>

      <!-- Puntuación Promedio -->
      <div class="card bg-gradient-to-br from-accent/10 to-accent/5 shadow-xl border border-accent/20">
        <div class="card-body">
          <h2 class="card-title text-accent text-sm font-medium">Racha Días</h2>
          <div class="flex items-center gap-3">
            <div class="text-3xl font-bold text-accent">{{ data?.averageScore || 0 }}</div>
            <div class="text-xs opacity-70">🔥 +3 días</div>
          </div>
          <p class="text-xs opacity-70">Puntuación promedio</p>
        </div>
      </div>

      <!-- Precisión -->
      <div class="card bg-gradient-to-br from-info/10 to-info/5 shadow-xl border border-info/20">
        <div class="card-body">
          <h2 class="card-title text-info text-sm font-medium">Precisión</h2>
          <div class="flex items-center gap-3">
            <div class="text-3xl font-bold text-info">{{ data?.averageAccuracy || 0 }}%</div>
            <div class="text-xs opacity-70">📊 87% vs mes</div>
          </div>
          <p class="text-xs opacity-70">Promedio de aciertos</p>
        </div>
      </div>
    </div>
  `
})
export class StatsCardsComponent {
  @Input() data: any = null;

  getTrendBadgeClass(): string {
    if (!this.data?.trend) return 'badge-neutral';

    switch (this.data.trend) {
      case 'improving': return 'badge-success';
      case 'declining': return 'badge-warning';
      default: return 'badge-neutral';
    }
  }

  getTrendText(): string {
    if (!this.data?.trend) return 'Estable';

    switch (this.data.trend) {
      case 'improving': return '↗️ Mejorando';
      case 'declining': return '↘️ Bajando';
      default: return '→ Estable';
    }
  }
}
