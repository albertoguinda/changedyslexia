import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="card-title text-lg">Ì∑† Insights Personalizados</h3>
          <div class="badge badge-accent badge-outline">IA Asistente</div>
        </div>
        
        <div class="space-y-4">
          <div *ngFor="let insight of insights; let i = index" 
               class="alert border-l-4 hover:bg-base-200 transition-all duration-200"
               [ngClass]="insight.alertClass"
               [style.animation-delay]="i * 150 + 'ms'"
               style="animation: fadeInUp 0.6s ease-out forwards; opacity: 0;">
            
            <div class="flex items-start gap-3">
              <div class="text-2xl">{{insight.icon}}</div>
              <div class="flex-1">
                <h4 class="font-semibold text-sm">{{insight.title}}</h4>
                <p class="text-xs text-base-content/70 mt-1">{{insight.description}}</p>
                <div *ngIf="insight.action" class="mt-2">
                  <button class="btn btn-xs" [ngClass]="insight.buttonClass">{{insight.action}}</button>
                </div>
              </div>
              <div *ngIf="insight.value" class="text-right">
                <div class="text-sm font-bold" [ngClass]="insight.valueClass">{{insight.value}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="divider text-xs">Recomendaci√≥n del d√≠a</div>
        
        <div class="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
          <div class="flex items-center gap-3">
            <div class="text-3xl">ÌæØ</div>
            <div>
              <h4 class="font-bold text-primary">Enf√≥cate en Escritura</h4>
              <p class="text-sm text-base-content/80">Seg√∫n tu progreso, 15 minutos extra de escritura te ayudar√°n a alcanzar tu objetivo semanal.</p>
              <button class="btn btn-primary btn-sm mt-2 rounded-full">Iniciar Ejercicios</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class InsightsComponent {
  insights = [
    {
      icon: 'Ì≥à',
      title: 'Excelente progreso en Comprensi√≥n',
      description: 'Has mejorado un 12% en las √∫ltimas dos semanas. ¬°Sigue as√≠!',
      alertClass: 'alert-success border-l-success',
      value: '+12%',
      valueClass: 'text-success',
      action: null,
      buttonClass: ''
    },
    {
      icon: '‚ö°',
      title: 'Mejor momento para estudiar',
      description: 'Tus mejores resultados son entre 10:00-11:30 AM. Planifica sesiones importantes en este horario.',
      alertClass: 'alert-info border-l-info',
      value: '10-11:30',
      valueClass: 'text-info',
      action: 'Programar',
      buttonClass: 'btn-info'
    },
    {
      icon: 'ÌæØ',
      title: 'Oportunidad de mejora',
      description: 'La fonolog√≠a necesita m√°s pr√°ctica. 10 minutos diarios pueden hacer gran diferencia.',
      alertClass: 'alert-warning border-l-warning',
      value: 'Fonolog√≠a',
      valueClass: 'text-warning',
      action: 'Practicar',
      buttonClass: 'btn-warning'
    },
    {
      icon: 'ÌøÜ',
      title: 'Pr√≥ximo al logro "Constancia"',
      description: 'Solo necesitas 1 d√≠a m√°s de pr√°ctica consecutiva para desbloquearlo.',
      alertClass: 'alert-error border-l-error',
      value: '1 d√≠a',
      valueClass: 'text-error',
      action: 'Ver Logros',
      buttonClass: 'btn-error'
    }
  ];
}
