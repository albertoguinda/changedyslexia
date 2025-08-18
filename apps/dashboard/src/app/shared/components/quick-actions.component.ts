import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body p-6">
        <h3 class="card-title text-lg mb-6">‚ö° Acciones R√°pidas</h3>
        
        <div class="space-y-4">
          <button *ngFor="let action of actions" 
                  class="btn w-full justify-start gap-3 hover:scale-105 transition-transform"
                  [ngClass]="action.className">
            <span class="text-xl">{{action.icon}}</span>
            <div class="text-left">
              <div class="font-medium">{{action.title}}</div>
              <div class="text-xs opacity-70">{{action.subtitle}}</div>
            </div>
          </button>
        </div>

        <!-- Progreso del d√≠a -->
        <div class="divider">Progreso Diario</div>
        
        <div class="space-y-3">
          <div *ngFor="let goal of dailyGoals" class="flex items-center justify-between">
            <span class="text-sm">{{goal.name}}</span>
            <div class="flex items-center gap-2">
              <progress class="progress progress-primary w-20" [value]="goal.current" [max]="goal.target"></progress>
              <span class="text-xs">{{goal.current}}/{{goal.target}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuickActionsComponent {
  actions = [
    {
      icon: 'ÌæÆ',
      title: 'Iniciar Sesi√≥n',
      subtitle: 'Ejercicios personalizados',
      className: 'btn-primary'
    },
    {
      icon: 'Ì≥ä',
      title: 'Ver Progreso',
      subtitle: 'An√°lisis detallado',
      className: 'btn-secondary'
    },
    {
      icon: 'ÌøÜ',
      title: 'Logros',
      subtitle: '3 nuevos disponibles',
      className: 'btn-accent'
    },
    {
      icon: '‚öôÔ∏è',
      title: 'Configuraci√≥n',
      subtitle: 'Preferencias y ajustes',
      className: 'btn-ghost'
    }
  ];

  dailyGoals = [
    { name: 'Lectura', current: 15, target: 20 },
    { name: 'Escritura', current: 8, target: 10 },
    { name: 'Memoria', current: 12, target: 15 }
  ];
}
