import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-progress-rings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="card-title text-lg">í¾¯ Objetivos de la Semana</h3>
          <div class="badge badge-primary badge-outline">Semana 33</div>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let skill of skills; let i = index" class="text-center">
            <div #ringContainer class="relative mx-auto mb-3" [id]="'ring-' + i" style="width: 80px; height: 80px;">
              <!-- El SVG se genera dinÃ¡micamente -->
            </div>
            <div class="text-sm font-medium text-base-content">{{skill.name}}</div>
            <div class="text-xs text-base-content/60">{{skill.current}}/{{skill.target}} sesiones</div>
            <div class="text-xs mt-1" [ngClass]="skill.progress >= 100 ? 'text-success' : skill.progress >= 75 ? 'text-warning' : 'text-base-content/50'">
              {{skill.progress}}% completado
            </div>
          </div>
        </div>

        <div class="divider">PrÃ³ximo objetivo</div>
        
        <div class="alert alert-info bg-info/10 border border-info/30">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 class="font-bold">Â¡Faltan 2 sesiones de escritura!</h4>
            <div class="text-sm">Completa el objetivo semanal para desbloquear el logro "Escritor Constante" í¿†</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProgressRingsComponent implements OnInit {
  @ViewChild('ringContainer', { static: false }) ringContainer!: ElementRef;

  skills = [
    { name: 'Lectura', current: 8, target: 10, progress: 80, color: '#f472b6' },
    { name: 'Escritura', current: 6, target: 8, progress: 75, color: '#8b5cf6' },
    { name: 'Memoria', current: 12, target: 12, progress: 100, color: '#06b6d4' },
    { name: 'FonologÃ­a', current: 7, target: 10, progress: 70, color: '#f59e0b' }
  ];

  ngOnInit() {
    setTimeout(() => this.createRings(), 100);
  }

  createRings() {
    this.skills.forEach((skill, index) => {
      const container = document.getElementById(`ring-${index}`);
      if (!container) return;

      const size = 80;
      const strokeWidth = 8;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;

      const svg = d3.select(container)
        .append('svg')
        .attr('width', size)
        .attr('height', size)
        .style('transform', 'rotate(-90deg)');

      const g = svg.append('g')
        .attr('transform', `translate(${size/2}, ${size/2})`);

      // Background circle
      g.append('circle')
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', strokeWidth);

      // Progress circle
      const progressCircle = g.append('circle')
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('stroke', skill.color)
        .attr('stroke-width', strokeWidth)
        .attr('stroke-linecap', 'round')
        .attr('stroke-dasharray', circumference)
        .attr('stroke-dashoffset', circumference);

      // Animate progress
      const targetOffset = circumference - (skill.progress / 100) * circumference;
      progressCircle
        .transition()
        .duration(1500)
        .delay(index * 200)
        .ease(d3.easeQuadOut)
        .attr('stroke-dashoffset', targetOffset);

      // Center text
      const centerText = svg.append('g')
        .attr('transform', `translate(${size/2}, ${size/2}) rotate(90)`)
        .style('text-anchor', 'middle');

      centerText.append('text')
        .attr('y', -2)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', skill.color)
        .style('opacity', 0)
        .text(`${skill.current}`)
        .transition()
        .duration(500)
        .delay(1000 + index * 200)
        .style('opacity', 1);

      centerText.append('text')
        .attr('y', 12)
        .attr('font-size', '10px')
        .attr('fill', '#6b7280')
        .style('opacity', 0)
        .text(`/${skill.target}`)
        .transition()
        .duration(500)
        .delay(1200 + index * 200)
        .style('opacity', 1);
    });
  }
}
