import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart-gradient',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl h-96 hover:shadow-2xl transition-all duration-300">
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="card-title text-lg">Ì≥ä Progreso por Habilidades</h3>
          <div class="badge badge-primary badge-outline">√öltima semana</div>
        </div>
        <div #chartContainer class="relative w-full flex-1"></div>
        
        <!-- Tooltip -->
        <div #tooltip class="absolute bg-base-300 text-base-content px-3 py-2 rounded-lg shadow-lg pointer-events-none opacity-0 transition-all duration-200 z-50">
          <div class="text-sm font-semibold" id="tooltip-title"></div>
          <div class="text-xs" id="tooltip-value"></div>
          <div class="text-xs text-base-content/60" id="tooltip-extra"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bar-hover {
      filter: brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.15));
      transform: scaleY(1.02);
      transition: all 0.2s ease;
    }
  `]
})
export class BarChartGradientComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) container!: ElementRef;
  @ViewChild('tooltip', { static: true }) tooltip!: ElementRef;

  data = [
    { 
      key: "Comprensi√≥n", 
      value: 85, 
      target: 80,
      improvement: +12,
      color: "from-pink-300 to-pink-400",
      description: "Entendimiento de textos"
    },
    { 
      key: "Lectura", 
      value: 75, 
      target: 85,
      improvement: +8,
      color: "from-purple-300 to-purple-400",
      description: "Velocidad y fluidez"
    },
    { 
      key: "Memoria", 
      value: 70, 
      target: 75,
      improvement: +5,
      color: "from-indigo-300 to-indigo-400",
      description: "Memoria de trabajo"
    },
    { 
      key: "Escritura", 
      value: 60, 
      target: 70,
      improvement: +15,
      color: "from-sky-300 to-sky-400",
      description: "Ortograf√≠a y gram√°tica"
    },
    { 
      key: "Fonolog√≠a", 
      value: 55, 
      target: 65,
      improvement: +10,
      color: "from-orange-200 to-orange-300",
      description: "Conciencia fonol√≥gica"
    }
  ];

  ngOnInit() {
    setTimeout(() => this.createChart(), 100);
  }

  createChart() {
    const container = this.container.nativeElement;
    const tooltip = this.tooltip.nativeElement;
    const width = 400;
    const height = 240;
    
    const yScale = d3.scaleBand()
      .domain(this.data.map(d => d.key))
      .range([0, height])
      .padding(0.2);

    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width - 140]);

    const chartDiv = d3.select(container)
      .style('position', 'relative')
      .style('width', '100%')
      .style('height', '100%');

    // Grid lines
    const gridLines = [20, 40, 60, 80, 100];
    gridLines.forEach(value => {
      chartDiv.append('div')
        .style('position', 'absolute')
        .style('left', `${90 + xScale(value)}px`)
        .style('top', '0px')
        .style('width', '1px')
        .style('height', `${height}px`)
        .style('background', 'rgba(148, 163, 184, 0.2)')
        .style('opacity', '0')
        .transition()
        .duration(800)
        .delay(200)
        .style('opacity', '1');
    });

    this.data.forEach((d, i) => {
      const barWidth = xScale(d.value);
      const barHeight = yScale.bandwidth();
      
      // Target line (meta)
      const targetWidth = xScale(d.target);
      chartDiv.append('div')
        .style('position', 'absolute')
        .style('left', `${90 + targetWidth - 1}px`)
        .style('top', `${yScale(d.key)}px`)
        .style('width', '2px')
        .style('height', `${barHeight}px`)
        .style('background', '#ef4444')
        .style('opacity', '0')
        .transition()
        .duration(600)
        .delay(1000 + i * 100)
        .style('opacity', '0.8');

      // Progress bar
      const progressBar = chartDiv.append('div')
        .style('position', 'absolute')
        .style('left', '90px')
        .style('top', `${yScale(d.key)}px`)
        .style('width', '0px') // Start from 0
        .style('height', `${barHeight}px`)
        .style('border-radius', '0 6px 6px 0')
        .style('cursor', 'pointer')
        .attr('class', `bg-gradient-to-r ${d.color}`)
        .on('mouseenter', function(event) {
          // Hover effect
          d3.select(this).classed('bar-hover', true);
          
          // Show tooltip
          d3.select(tooltip)
            .style('opacity', '1')
            .style('left', `${event.offsetX + 10}px`)
            .style('top', `${event.offsetY - 60}px`);
          
          d3.select('#tooltip-title').text(d.key);
          d3.select('#tooltip-value').text(`${d.value}% (Meta: ${d.target}%)`);
          d3.select('#tooltip-extra').text(d.improvement > 0 ? `‚Üó +${d.improvement}% vs semana pasada` : `‚Üò ${d.improvement}% vs semana pasada`);
        })
        .on('mouseleave', function() {
          d3.select(this).classed('bar-hover', false);
          d3.select(tooltip).style('opacity', '0');
        });

      // Animate bar width
      progressBar
        .transition()
        .duration(800)
        .delay(i * 150)
        .ease(d3.easeElasticOut.amplitude(1).period(0.5))
        .style('width', `${barWidth}px`);

      // Labels with animation
      chartDiv.append('div')
        .style('position', 'absolute')
        .style('left', '8px')
        .style('top', `${yScale(d.key)! + barHeight/2}px`)
        .style('transform', 'translateY(-50%)')
        .style('font-size', '12px')
        .style('color', '#6B7280')
        .style('font-weight', '500')
        .style('opacity', '0')
        .text(d.key)
        .transition()
        .duration(400)
        .delay(i * 100 + 300)
        .style('opacity', '1');

      // Values with animation
      chartDiv.append('div')
        .style('position', 'absolute')
        .style('left', `${90 + barWidth + 8}px`)
        .style('top', `${yScale(d.key)! + barHeight/2}px`)
        .style('transform', 'translateY(-50%)')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('color', '#374151')
        .style('opacity', '0')
        .text(`${d.value}%`)
        .transition()
        .duration(400)
        .delay(i * 100 + 500)
        .style('opacity', '1');
    });

    // Add legend
    chartDiv.append('div')
      .style('position', 'absolute')
      .style('bottom', '10px')
      .style('right', '10px')
      .style('font-size', '10px')
      .style('color', '#9CA3AF')
      .style('opacity', '0')
      .html('Ì≥ç <span style="color: #ef4444;">L√≠nea roja = Meta</span>')
      .transition()
      .duration(400)
      .delay(1500)
      .style('opacity', '1');
  }
}
