import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl h-96 hover:shadow-2xl transition-all duration-300">
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="card-title text-lg">��� Tiempo por Actividad</h3>
          <div class="badge badge-accent badge-outline">Hoy</div>
        </div>
        <div #chartContainer class="relative w-full flex-1 flex items-center justify-center">
          <div class="absolute inset-0 flex flex-col items-center justify-center z-10">
            <span class="text-sm font-medium text-base-content/80">Completado</span>
            <div class="text-4xl font-bold">
              <span class="bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent animate-pulse">75%</span>
            </div>
            <span class="text-xs text-base-content/60">objetivos semanales</span>
            <div class="text-xs text-success font-medium mt-1">+5% vs ayer</div>
          </div>
        </div>
        
        <!-- Legend interactiva -->
        <div class="grid grid-cols-2 gap-2 mt-4">
          <div *ngFor="let item of data; let i = index" 
               class="flex items-center gap-2 p-2 rounded hover:bg-base-200 cursor-pointer transition-all"
               (mouseenter)="highlightSegment(i)" 
               (mouseleave)="unhighlightSegment()">
            <div class="w-3 h-3 rounded-full" [style.background-color]="item.color"></div>
            <div class="flex-1">
              <div class="text-xs font-medium">{{item.name}}</div>
              <div class="text-xs text-base-content/60">{{item.value}}% • {{item.time}}min</div>
            </div>
          </div>
        </div>

        <!-- Tooltip -->
        <div #tooltip class="absolute bg-base-300/95 backdrop-blur text-base-content px-3 py-2 rounded-lg shadow-lg pointer-events-none opacity-0 transition-all duration-200 z-50">
          <div class="text-sm font-semibold" id="tooltip-activity"></div>
          <div class="text-xs" id="tooltip-details"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .segment-hover {
      filter: brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2));
      transform: scale(1.05);
      transition: all 0.2s ease;
    }
  `]
})
export class DonutChartComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) container!: ElementRef;
  @ViewChild('tooltip', { static: true }) tooltip!: ElementRef;

  data = [
    { name: "Juegos Lectura", value: 35, time: 42, color: "#f472b6", description: "Ejercicios de comprensión lectora" },
    { name: "Ejercicios Memoria", value: 25, time: 30, color: "#8b5cf6", description: "Entrenamientos de memoria de trabajo" },
    { name: "Práctica Escritura", value: 15, time: 18, color: "#06b6d4", description: "Actividades de escritura y ortografía" },
    { name: "Tiempo Libre", value: 25, time: 30, color: "#e5e7eb", description: "Descansos entre actividades" }
  ];

  private segments: any;

  ngOnInit() {
    setTimeout(() => this.createChart(), 100);
  }

  createChart() {
    const container = this.container.nativeElement;
    const tooltip = this.tooltip.nativeElement;
    const size = 220;
    const radius = size / 2;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .style('position', 'absolute')
      .style('top', '50%')
      .style('left', '50%')
      .style('transform', 'translate(-50%, -50%)');

    const g = svg.append('g')
      .attr('transform', `translate(${size/2}, ${size/2})`);

    const pie = d3.pie<any>()
      .value(d => d.value)
      .startAngle(-Math.PI / 2)
      .endAngle(3 * Math.PI / 2)
      .sort(null)
      .padAngle(0.03);

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.55)
      .outerRadius(radius * 0.85)
      .cornerRadius(8);

    const hoverArc = d3.arc<any>()
      .innerRadius(radius * 0.52)
      .outerRadius(radius * 0.88)
      .cornerRadius(8);

    const arcs = pie(this.data);

    // Create gradients
    const defs = svg.append('defs');
    this.data.forEach((d, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `donut-gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', 0.9);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', 0.6);
    });

    // Create segments
    this.segments = g.selectAll('.arc')
      .data(arcs)
      .enter()
      .append('path')
      .attr('class', 'arc')
      .attr('d', arc)
      .attr('fill', (d: any, i: number) => `url(#donut-gradient-${i})`)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
      .style('cursor', 'pointer')
      .on('mouseenter', (event: any, d: any) => {
        const segment = d3.select(event.currentTarget);
        segment.transition()
          .duration(200)
          .attr('d', hoverArc);

        d3.select(tooltip)
          .style('opacity', '1')
          .style('left', `${event.offsetX + 10}px`)
          .style('top', `${event.offsetY - 50}px`);
        
        d3.select('#tooltip-activity').text(d.data.name);
        d3.select('#tooltip-details').text(`${d.data.value}% • ${d.data.time}min • ${d.data.description}`);
      })
      .on('mouseleave', (event: any) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('d', arc);
        
        d3.select(tooltip).style('opacity', '0');
      });

    // Animate segments - ARREGLADO EL TIPADO
    this.segments
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((_d: any, i: number) => i * 200)
      .ease(d3.easeElasticOut.amplitude(1).period(0.4))
      .style('opacity', 1);

    // Animated progress ring
    const progressRing = g.append('circle')
      .attr('r', radius * 0.45)
      .attr('fill', 'none')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 4);

    const progressArc = g.append('circle')
      .attr('r', radius * 0.45)
      .attr('fill', 'none')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', `${2 * Math.PI * radius * 0.45}`)
      .attr('stroke-dashoffset', `${2 * Math.PI * radius * 0.45}`)
      .attr('transform', 'rotate(-90)')
      .transition()
      .duration(1500)
      .delay(800)
      .ease(d3.easeQuadOut)
      .attr('stroke-dashoffset', `${2 * Math.PI * radius * 0.45 * 0.25}`);
  }

  highlightSegment(index: number) {
    this.segments.style('opacity', (d: any, i: number) => i === index ? 1 : 0.3);
  }

  unhighlightSegment() {
    this.segments.style('opacity', 1);
  }
}
