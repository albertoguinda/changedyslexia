import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-line-chart-pulse',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Evolución del Rendimiento</h3>
      <p-chart
        type="line"
        [data]="chartData"
        [options]="chartOptions"
        height="300">
      </p-chart>
      <div class="mt-4 flex justify-between text-sm text-gray-600">
        <span>{{totalPoints}} sesiones analizadas</span>
        <span class="font-semibold" [ngClass]="getTrendClass()">
          Tendencia: {{getTrendText()}}
        </span>
      </div>
    </div>
  `
})
export class LineChartPulseComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  totalPoints = 0;
  progressData: any[] = [];

  ngOnInit() {
    this.loadProgressData();
    this.setupChart();
  }

  private loadProgressData() {
    const sessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');

    if (sessions.length > 0) {
      const dailyData = new Map<string, {values: number[], date: Date}>();

      sessions.forEach((session: any) => {
        const date = new Date(session.date || session.timestamp);
        const dayKey = date.toDateString();

        if (!dailyData.has(dayKey)) {
          dailyData.set(dayKey, {values: [], date});
        }

        if (session.accuracy && session.accuracy > 0) {
          dailyData.get(dayKey)!.values.push(session.accuracy);
        }
      });

      this.progressData = Array.from(dailyData.values())
        .filter(day => day.values.length > 0)
        .map(day => ({
          date: day.date,
          value: Math.round(day.values.reduce((a, b) => a + b, 0) / day.values.length)
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(-10);
    } else {
      this.progressData = this.generateDemoData();
    }

    this.totalPoints = this.progressData.length;
  }

  private generateDemoData() {
    const data = [];
    const today = new Date();

    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const baseValue = 65 + (9 - i) * 2 + Math.random() * 10;

      data.push({
        date,
        value: Math.round(Math.min(100, Math.max(20, baseValue)))
      });
    }
    return data;
  }

  private setupChart() {
    this.chartData = {
      labels: this.progressData.map(p => p.date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Precisión',
        data: this.progressData.map(p => p.value),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 40,
          max: 100,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            callback: function(value: any) {
              return value + '%';
            }
          }
        },
        x: { grid: { display: false } }
      }
    };
  }

  getTrendText(): string {
    if (this.progressData.length < 2) return 'Sin datos';

    const first = this.progressData[0].value;
    const last = this.progressData[this.progressData.length - 1].value;
    const diff = last - first;

    if (diff > 10) return 'Excelente ↗';
    if (diff > 5) return 'Mejorando ↗';
    if (diff < -10) return 'Descendente ↘';
    if (diff < -5) return 'Irregular ↘';
    return 'Estable →';
  }

  getTrendClass(): string {
    const trend = this.getTrendText();
    if (trend.includes('↗')) return 'text-green-600';
    if (trend.includes('↘')) return 'text-red-600';
    return 'text-gray-600';
  }
}
