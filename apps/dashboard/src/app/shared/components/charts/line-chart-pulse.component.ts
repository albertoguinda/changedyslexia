import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart-pulse',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl h-96 hover:shadow-2xl transition-all duration-300">
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="card-title text-lg">Ì≥à Evoluci√≥n Temporal</h3>
          <div class="badge badge-secondary badge-outline">√öltimos 2 meses</div>
        </div>
        <div #chartContainer class="relative w-full flex-1"></div>
        
        <!-- Tooltip mejorado -->
        <div #tooltip class="absolute bg-base-300/95 backdrop-blur text-base-content px-4 py-3 rounded-xl shadow-xl pointer-events-none opacity-0 transition-all duration-200 z-50 border border-base-content/10">
          <div class="text-sm font-bold" id="tooltip-date"></div>
          <div class="text-lg font-extrabold bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent" id="tooltip-score"></div>
          <div class="text-xs text-base-content/70" id="tooltip-trend"></div>
        </div>

        <!-- Stats bar -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-base-content/10">
          <div class="text-center">
            <div class="text-xs text-base-content/60">Progreso Total</div>
            <div class="text-sm font-bold text-success">+20%</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-base-content/60">Mejor Semana</div>
            <div class="text-sm font-bold text-primary">85%</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-base-content/60">Racha</div>
            <div class="text-sm font-bold text-warning">9 d√≠as</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-point {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .data-point:hover {
      filter: drop-shadow(0 0 8px rgba(244, 114, 182, 0.6));
      transform: scale(1.2);
    }
    .grid-line {
      opacity: 0.3;
      transition: opacity 0.2s ease;
    }
    .grid-line:hover {
      opacity: 0.6;
    }
  `]
})
export class LineChartPulseComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) container!: ElementRef;
  @ViewChild('tooltip', { static: true }) tooltip!: ElementRef;

  data = [
    { date: new Date('2024-06-17'), value: 65, sessions: 3, time: 45 },
    { date: new Date('2024-06-24'), value: 68, sessions: 4, time: 52 },
    { date: new Date('2024-07-01'), value: 71, sessions: 5, time: 48 },
    { date: new Date('2024-07-08'), value: 69, sessions: 3, time: 35 },
    { date: new Date('2024-07-15'), value: 75, sessions: 6, time: 58 },
    { date: new Date('2024-07-22'), value: 78, sessions: 5, time: 55 },
    { date: new Date('2024-07-29'), value: 76, sessions: 4, time: 42 },
    { date: new Date('2024-08-05'), value: 81, sessions: 7, time: 65 },
    { date: new Date('2024-08-17'), value: 85, sessions: 6, time: 60 }
  ];

  ngOnInit() {
    setTimeout(() => this.createChart(), 100);
  }

  createChart() {
    const container = this.container.nativeElement;
    const tooltip = this.tooltip.nativeElement;
    const width = 400;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    // Clear previous
    d3.select(container).selectAll("*").remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`);

    const xScale = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([60, 90])
      .range([height - margin.bottom, margin.top]);

    // Grid lines with animation
    const gridLines = yScale.ticks(6);
    svg.selectAll('.grid-line')
      .data(gridLines)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '2,4')
      .attr('stroke-width', 1)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .style('opacity', 0.3);

    // Area gradient
    const area = d3.area<any>()
      .x(d => xScale(d.date))
      .y0(yScale(60))
      .y1(d => yScale(d.value))
      .curve(d3.curveCardinal);

    const areaGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', yScale(90))
      .attr('x2', 0).attr('y2', yScale(60));

    areaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 0.3);

    areaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f472b6')
      .attr('stop-opacity', 0.1);

    // Area path
    svg.append('path')
      .datum(this.data)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area)
      .style('opacity', 0)
      .transition()
      .duration(1200)
      .delay(400)
      .style('opacity', 1);

    // Line gradient
    const lineGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', width).attr('y2', 0);

    lineGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#8b5cf6');

    lineGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f472b6');

    const line = d3.line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal);

    // Animated line
    const path = svg.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    const totalLength = path.node()!.getTotalLength();
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeQuadInOut)
      .attr('stroke-dashoffset', 0);

    // Interactive data points
    svg.selectAll('.data-point')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 0)
      .attr('fill', '#f472b6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))')
      .on('mouseenter', function(event, d) {
        const trend = d.value > 75 ? 'Ì≥à Excelente progreso' : d.value > 70 ? 'Ì≥ä Buen avance' : 'Ì≤™ Sigue mejorando';
        
        d3.select(tooltip)
          .style('opacity', '1')
          .style('left', `${event.offsetX + 15}px`)
          .style('top', `${event.offsetY - 80}px`);
        
        d3.select('#tooltip-date').text(d.date.toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short' 
        }));
        d3.select('#tooltip-score').text(`${d.value}%`);
        d3.select('#tooltip-trend').text(`${trend} ‚Ä¢ ${d.sessions} sesiones ‚Ä¢ ${d.time}min`);
      })
      .on('mouseleave', function() {
        d3.select(tooltip).style('opacity', '0');
      })
      .transition()
      .duration(500)
      .delay((d, i) => 1500 + i * 100)
      .attr('r', 6);

    // Pulsating final point
    const lastPoint = this.data[this.data.length - 1];
    svg.append('circle')
      .attr('cx', xScale(lastPoint.date))
      .attr('cy', yScale(lastPoint.value))
      .attr('r', 6)
      .attr('fill', 'none')
      .attr('stroke', '#f472b6')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(2500)
      .style('opacity', 1)
      .on('end', function() {
        d3.select(this)
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr('r', 12)
          .style('opacity', 0)
          .on('end', function() {
            d3.select(this).attr('r', 6).style('opacity', 1);
          });
      });

    // Y-axis labels
    svg.selectAll('.y-label')
      .data(yScale.ticks(5))
      .enter()
      .append('text')
      .attr('class', 'y-label')
      .attr('x', margin.left - 8)
      .attr('y', d => yScale(d))
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('font-size', '11px')
      .attr('fill', '#6b7280')
      .style('opacity', 0)
      .text(d => d + '%')
      .transition()
      .duration(600)
      .delay(1000)
      .style('opacity', 1);
  }
}
