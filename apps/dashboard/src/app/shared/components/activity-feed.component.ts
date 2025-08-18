import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="card-title text-lg">Ìæâ Actividad Reciente</h3>
          <div class="badge badge-info badge-outline">√öltimas 24h</div>
        </div>
        
        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div *ngFor="let activity of activities; let i = index" 
               class="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition-all duration-200"
               [style.animation-delay]="i * 100 + 'ms'"
               style="animation: slideInLeft 0.5s ease-out forwards; opacity: 0;">
            
            <div class="avatar">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                   [ngClass]="activity.bgClass">
                {{activity.icon}}
              </div>
            </div>
            
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-base-content">{{activity.title}}</p>
              <p class="text-xs text-base-content/60">{{activity.description}}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-base-content/50">{{activity.time}}</span>
                <div *ngIf="activity.points" class="badge badge-warning badge-xs">+{{activity.points}} pts</div>
              </div>
            </div>
            
            <div *ngIf="activity.value" class="text-right">
              <div class="text-sm font-bold" [ngClass]="activity.valueClass">{{activity.value}}</div>
            </div>
          </div>
        </div>

        <div class="divider text-xs">Resumen del d√≠a</div>
        
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-lg font-bold text-success">12</div>
            <div class="text-xs text-base-content/60">Ejercicios</div>
          </div>
          <div>
            <div class="text-lg font-bold text-primary">235</div>
            <div class="text-xs text-base-content/60">Puntos</div>
          </div>
          <div>
            <div class="text-lg font-bold text-secondary">3</div>
            <div class="text-xs text-base-content/60">Logros</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ActivityFeedComponent {
  activities = [
    {
      icon: 'ÌøÜ',
      title: '¬°Nuevo r√©cord personal!',
      description: 'Completaste 6 ejercicios de lectura consecutivos',
      time: 'Hace 5 min',
      points: 25,
      bgClass: 'bg-warning/20',
      value: null,
      valueClass: ''
    },
    {
      icon: 'Ì≥à',
      title: 'Mejora en Comprensi√≥n',
      description: 'Tu puntuaci√≥n subi√≥ al 85%',
      time: 'Hace 15 min',
      points: 15,
      bgClass: 'bg-success/20',
      value: '+3%',
      valueClass: 'text-success'
    },
    {
      icon: 'ÌæØ',
      title: 'Objetivo diario alcanzado',
      description: 'Meta de 20 minutos de pr√°ctica completada',
      time: 'Hace 1 hora',
      points: 10,
      bgClass: 'bg-primary/20',
      value: '20/20',
      valueClass: 'text-primary'
    },
    {
      icon: 'Ì∑†',
      title: 'Sesi√≥n de memoria completada',
      description: 'Ejercicios de memoria de trabajo - Nivel intermedio',
      time: 'Hace 2 horas',
      points: 12,
      bgClass: 'bg-secondary/20',
      value: '92%',
      valueClass: 'text-secondary'
    },
    {
      icon: '‚úçÔ∏è',
      title: 'Pr√°ctica de escritura',
      description: 'Ortograf√≠a y gram√°tica - 8 palabras correctas',
      time: 'Hace 3 horas',
      points: 8,
      bgClass: 'bg-info/20',
      value: '8/10',
      valueClass: 'text-info'
    },
    {
      icon: 'Ì¥•',
      title: 'Racha de 9 d√≠as',
      description: 'Mant√©n el buen trabajo para llegar a 10 d√≠as',
      time: 'Hace 6 horas',
      points: 50,
      bgClass: 'bg-error/20',
      value: '9 d√≠as',
      valueClass: 'text-error'
    }
  ];
}
