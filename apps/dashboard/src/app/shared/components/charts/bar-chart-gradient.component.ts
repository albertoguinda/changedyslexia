import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-bar-chart-gradient',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Progreso por Habilidades</h3>
      <p-chart
        type="bar"
        [data]="chartData"
        [options]="chartOptions"
        height="300">
      </p-chart>
      <div class="mt-4 text-sm text-gray-600">
        Basado en {{totalSessions}} sesiones de juego
      </div>
    </div>
  `
})
export class BarChartGradientComponent implements OnInit {
  chartData: any;
  chartOptions: any;
  totalSessions = 0;

  ngOnInit() {
    this.loadData();
    this.setupChart();
  }

  private loadData() {
    const sessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
    this.totalSessions = sessions.length;

    const recent = sessions.slice(-10);

    const skills = [
      { name: 'Discriminación Visual', value: this.calculateAvg(recent, 'visualDiscrimination') || 85 },
      { name: 'Construcción Silábica', value: this.calculateWordBuilding(recent) || 78 },
      { name: 'Velocidad Procesamiento', value: this.calculateAvg(recent, 'processingSpeed') || 72 },
      { name: 'Atención Sostenida', value: this.calculateAvg(recent, 'attentionSpan') || 68 }
    ].sort((a, b) => b.value - a.value);

    this.chartData = {
      labels: skills.map(s => s.name),
      datasets: [{
        data: skills.map(s => s.value),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }]
    };
  }

  private setupChart() {
    this.chartOptions = {
      indexAxis: 'y',
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
        x: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            callback: function(value: any) {
              return value + '%';
            }
          }
        },
        y: { grid: { display: false } }
      }
    };
  }

  private calculateAvg(sessions: any[], field: string): number {
    const valid = sessions.filter(s => s[field] !== undefined && s[field] > 0);
    if (valid.length === 0) return 0;
    return Math.round(valid.reduce((sum, s) => sum + s[field], 0) / valid.length);
  }

  private calculateWordBuilding(sessions: any[]): number {
    const wordSessions = sessions.filter(s => s.game === 'word-builder');
    if (wordSessions.length === 0) return 0;
    return this.calculateAvg(wordSessions, 'accuracy');
  }
}
