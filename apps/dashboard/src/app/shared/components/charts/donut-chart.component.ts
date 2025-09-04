import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Tiempo por Actividad</h3>
      <p-chart
        type="doughnut"
        [data]="chartData"
        [options]="chartOptions"
        height="300">
      </p-chart>
      <div class="mt-4 space-y-2">
        <div *ngFor="let item of legendData" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" [style.background-color]="item.color"></div>
            <span class="text-sm font-medium">{{item.label}}</span>
          </div>
          <span class="text-sm text-gray-600">{{item.value}} ({{item.percentage}}%)</span>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-gray-200 text-center">
        <span class="text-xs text-gray-500">
          Distribución de {{totalSessions}} sesiones por dispositivo
        </span>
      </div>
    </div>
  `
})
export class DonutChartComponent implements OnChanges {
  @Input() data: any = {};

  chartData: any;
  chartOptions: any;
  legendData: any[] = [];
  totalSessions = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.updateChart();
    }
  }

  private updateChart() {
    const deviceStyles = {
      mobile: { color: '#10b981', label: 'Móvil' },
      tablet: { color: '#3b82f6', label: 'Tablet' },
      desktop: { color: '#8b5cf6', label: 'Escritorio' }
    };

    this.totalSessions = Object.values(this.data).reduce((sum: number, val: any) => sum + val, 0);

    this.legendData = Object.entries(this.data).map(([key, value]: [string, any]) => {
      const style = deviceStyles[key as keyof typeof deviceStyles] || { color: '#6b7280', label: key };
      return {
        label: style.label,
        value: value,
        percentage: this.totalSessions > 0 ? Math.round((value / this.totalSessions) * 100) : 0,
        color: style.color
      };
    }).sort((a, b) => b.value - a.value);

    this.chartData = {
      labels: this.legendData.map(item => item.label),
      datasets: [{
        data: this.legendData.map(item => item.value),
        backgroundColor: this.legendData.map(item => item.color),
        borderWidth: 2,
        borderColor: '#ffffff'
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
      cutout: '60%'
    };
  }
}
