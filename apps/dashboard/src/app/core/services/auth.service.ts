import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loginDemo(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        if (email === 'demo@cognitiveplaykit.com' && password === 'demo123') {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('cognitive_token', 'demo-token');
          }
          observer.next({ success: true, user: { name: 'Usuario Demo' } });
          observer.complete();
        } else {
          observer.error(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return localStorage.getItem('cognitive_token') !== null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cognitive_token');
    }
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser() {
    return { name: 'Usuario Demo' };
  }
}
