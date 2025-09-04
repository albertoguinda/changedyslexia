import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import { WordBuilderScene } from '../scenes/WordBuilderScene';

export class ModalManager {
   constructor(private scene: WordBuilderScene) {}

   showWelcomeModal(onStart: () => void) {
       this.scene.scene.pause();
       
       Swal.fire({
           title: '🔤 Constructor de Palabras',
           html: `
               <div style="font-family: 'OpenDyslexic', 'Inter', sans-serif; padding: 8px; line-height: 1.5;">
                   <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1)); 
                               padding: 12px; border-radius: 8px; margin-bottom: 12px; 
                               border: 2px solid rgba(16, 185, 129, 0.2);">
                       <h3 style="margin: 0 0 6px 0; color: #059669; font-size: 16px; font-weight: 700;">
                           🎯 Construye palabras con sílabas
                       </h3>
                       <p style="margin: 0; color: #374151; font-size: 13px;">
                           Arrastra las <strong style="color: #059669;">sílabas</strong> a los cuadros para formar la palabra del emoji.
                       </p>
                   </div>
                   
                   <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0;">
                       <div style="background: rgba(16, 185, 129, 0.1); padding: 8px; border-radius: 6px; 
                                   border: 2px solid rgba(16, 185, 129, 0.3); text-align: center;">
                           <div style="font-size: 16px; margin-bottom: 4px;">✅</div>
                           <div style="font-weight: 600; color: #059669; font-size: 12px;">¡Correcto!</div>
                           <div style="font-size: 10px; color: #6b7280;">+50 puntos</div>
                       </div>
                       <div style="background: rgba(79, 70, 229, 0.1); padding: 8px; border-radius: 6px; 
                                   border: 2px solid rgba(79, 70, 229, 0.3); text-align: center;">
                           <div style="font-size: 16px; margin-bottom: 4px;">💡</div>
                           <div style="font-weight: 600; color: #4f46e5; font-size: 12px;">Pista</div>
                           <div style="font-size: 10px; color: #6b7280;">Botón ayuda</div>
                       </div>
                   </div>
               </div>
           `,
           confirmButtonText: '🚀 ¡Construir!',
           confirmButtonColor: '#10b981',
           allowOutsideClick: false,
           allowEscapeKey: false,
           backdrop: false,
           buttonsStyling: false,
           width: '90%',
           padding: '1rem',
           showClass: {
               popup: 'animate__animated animate__fadeIn animate__faster'
           },
           hideClass: {
               popup: 'animate__animated animate__fadeOut animate__faster'
           },
           customClass: {
               popup: 'compact-game-popup',
               confirmButton: 'compact-game-btn'
           }
       }).then(() => {
           this.scene.scene.resume();
           
           confetti({
               particleCount: 50,
               spread: 60,
               origin: { y: 0.8 },
               colors: ['#10b981', '#34d399', '#6ee7b7']
           });
           
           setTimeout(() => {
               onStart();
           }, 200);
       });
   }

   showLevelUp(level: number, onContinue: () => void) {
       this.scene.scene.pause();
       
       confetti({
           particleCount: 100,
           spread: 80,
           origin: { y: 0.6 },
           colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b']
       });

       Swal.fire({
           title: '🎉 ¡NIVEL COMPLETADO!',
           html: `
               <div style="font-family: 'OpenDyslexic', 'Inter', sans-serif; padding: 12px; text-align: center;">
                   <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1)); 
                               padding: 12px; border-radius: 8px; margin-bottom: 8px;
                               border: 2px solid rgba(16, 185, 129, 0.25);">
                       <div style="font-size: 24px; font-weight: bold; color: #059669; margin-bottom: 4px;">
                           NIVEL ${level}
                       </div>
                       <div style="font-size: 12px; color: #6b7280;">
                           ¡Excelente trabajo! Sigues mejorando
                       </div>
                   </div>
                   <div style="color: #059669; font-size: 14px; font-weight: 600;">
                       +${level * 10} puntos bonus
                   </div>
               </div>
           `,
           timer: 2000,
           showConfirmButton: false,
           backdrop: false,
           width: '85%',
           padding: '0.8rem',
           showClass: {
               popup: 'animate__animated animate__bounceIn animate__faster'
           },
           hideClass: {
               popup: 'animate__animated animate__fadeOut animate__faster'
           },
           customClass: {
               popup: 'compact-game-popup'
           }
       }).then(() => {
           this.scene.scene.resume();
           setTimeout(() => {
               onContinue();
           }, 200);
       });
   }

   showGameWin(sessionData: any) {
       this.scene.scene.pause();
       
       confetti({
           particleCount: 200,
           spread: 100,
           origin: { y: 0.5 },
           colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b']
       });

       Swal.fire({
           title: '🏆 ¡MAESTRO CONSTRUCTOR!',
           html: `
               <div style="font-family: 'OpenDyslexic', 'Inter', sans-serif; padding: 12px;">
                   <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1)); 
                               padding: 12px; border-radius: 8px; margin-bottom: 12px;
                               border: 2px solid rgba(16, 185, 129, 0.25);">
                       <div style="font-size: 14px; font-weight: 600; color: #059669; margin-bottom: 4px;">
                           ¡Has completado todos los niveles!
                       </div>
                       <div style="font-size: 11px; color: #6b7280;">
                           Tiempo total: ${Math.floor(sessionData.totalPlayTime / 60)}m ${sessionData.totalPlayTime % 60}s
                       </div>
                   </div>
                   
                   <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                       <div style="background: rgba(16, 185, 129, 0.1); padding: 8px; border-radius: 6px; 
                                   text-align: center; border: 2px solid rgba(16, 185, 129, 0.3);">
                           <div style="font-size: 16px; font-weight: bold; color: #059669; margin-bottom: 2px;">
                               ${sessionData.score}
                           </div>
                           <div style="font-size: 9px; color: #6b7280;">Puntos</div>
                       </div>
                       <div style="background: rgba(139, 92, 246, 0.1); padding: 8px; border-radius: 6px; 
                                   text-align: center; border: 2px solid rgba(139, 92, 246, 0.3);">
                           <div style="font-size: 16px; font-weight: bold; color: #7c3aed; margin-bottom: 2px;">
                               ${sessionData.accuracy}%
                           </div>
                           <div style="font-size: 9px; color: #6b7280;">Precisión</div>
                       </div>
                   </div>
               </div>
           `,
           showCancelButton: true,
           confirmButtonText: '🔄 Jugar Otra Vez',
           cancelButtonText: '📊 Ver Dashboard',
           confirmButtonColor: '#10b981',
           cancelButtonColor: '#6b7280',
           backdrop: false,
           buttonsStyling: false,
           width: '90%',
           padding: '1rem',
           showClass: {
               popup: 'animate__animated animate__zoomIn animate__faster'
           },
           hideClass: {
               popup: 'animate__animated animate__fadeOut animate__faster'
           },
           customClass: {
               popup: 'compact-game-popup',
               confirmButton: 'compact-game-btn',
               cancelButton: 'compact-game-btn-secondary'
           }
       }).then((result) => {
           if (result.isConfirmed) {
               (window as any).restartGame();
           } else if (result.dismiss === Swal.DismissReason.cancel) {
               window.open('http://localhost:4200', '_blank');
           }
       });
   }

   showGameOver(sessionData: any) {
       this.scene.scene.pause();
       
       Swal.fire({
           title: '🎮 Partida Terminada',
           html: `
               <div style="font-family: 'OpenDyslexic', 'Inter', sans-serif; padding: 12px;">
                   <div style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(139, 92, 246, 0.1)); 
                               padding: 12px; border-radius: 8px; margin-bottom: 12px;
                               border: 2px solid rgba(79, 70, 229, 0.25);">
                       <div style="font-size: 14px; font-weight: 600; color: #4f46e5; margin-bottom: 4px;">
                           ¡Buen trabajo, constructor!
                       </div>
                       <div style="font-size: 11px; color: #6b7280;">
                           Tiempo total: ${Math.floor(sessionData.totalPlayTime / 60)}m ${sessionData.totalPlayTime % 60}s
                       </div>
                   </div>
                   
                   <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                       <div style="background: rgba(16, 185, 129, 0.1); padding: 8px; border-radius: 6px; 
                                   text-align: center; border: 2px solid rgba(16, 185, 129, 0.3);">
                           <div style="font-size: 16px; font-weight: bold; color: #059669; margin-bottom: 2px;">
                               ${sessionData.score}
                           </div>
                           <div style="font-size: 9px; color: #6b7280;">Puntos</div>
                       </div>
                       <div style="background: rgba(239, 68, 68, 0.1); padding: 8px; border-radius: 6px; 
                                   text-align: center; border: 2px solid rgba(239, 68, 68, 0.3);">
                           <div style="font-size: 16px; font-weight: bold; color: #dc2626; margin-bottom: 2px;">
                               ${sessionData.accuracy}%
                           </div>
                           <div style="font-size: 9px; color: #6b7280;">Precisión</div>
                       </div>
                   </div>
               </div>
           `,
           showCancelButton: true,
           confirmButtonText: '🔄 Jugar Otra Vez',
           cancelButtonText: '📊 Ver Dashboard',
           confirmButtonColor: '#10b981',
           cancelButtonColor: '#6b7280',
           backdrop: false,
           buttonsStyling: false,
           width: '90%',
           padding: '1rem',
           showClass: {
               popup: 'animate__animated animate__fadeIn animate__faster'
           },
           hideClass: {
               popup: 'animate__animated animate__fadeOut animate__faster'
           },
           customClass: {
               popup: 'compact-game-popup',
               confirmButton: 'compact-game-btn',
               cancelButton: 'compact-game-btn-secondary'
           }
       }).then((result) => {
           if (result.isConfirmed) {
               (window as any).restartGame();
           } else if (result.dismiss === Swal.DismissReason.cancel) {
               window.open('http://localhost:4200', '_blank');
           }
       });
   }
}