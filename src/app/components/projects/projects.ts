import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;     // Captura de pantalla para la tarjeta
  demoUrl: string;   // URL del proyecto (Replit o Web)
  type: 'web' | 'console'; // Para saber si mostrar pantalla completa o terminal
}

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {

  private sanitizer = inject(DomSanitizer);

  // Estado del Modal
  isModalOpen = signal(false);
  currentProject = signal<Project | null>(null);
  safeUrl = signal<SafeResourceUrl | null>(null);

  // TUS PROYECTOS (Aquí cargarás tu data real)
  projects: Project[] = [
    {
      id: 1,
      title: 'Simulador de Fútbol',
      description: 'Simulación lógica de partidos y torneos desarrollada puramente en C. Gestión de memoria manual y algoritmos de probabilidad.',
      tags: ['Lenguaje C', 'Algoritmos', 'Estructuras de Datos'],
      image: 'assets/images/futbol-c.png', // Pon una captura de tu CMD
      // AQUÍ IRÁ TU LINK DE REPLIT (Ejemplo genérico)
      demoUrl: 'https://replit.com/@TomasOliver/TP-FINAL-SIFU-Simulador-fulbo-mainzip?embed=true&run=1&v=500',
      type: 'console'
    },
    {
      id: 2,
      title: 'Sistema de Gestión (S.I.F.U)',
      description: 'Aplicación web completa con Angular 19 y Tailwind para la gestión de usuarios y recursos.',
      tags: ['Angular', 'TypeScript', 'Tailwind'],
      image: 'assets/images/sifu-web.png',
      demoUrl: 'https://tu-proyecto-angular.vercel.app', // Ejemplo
      type: 'web'
    }
  ];

  // Abrir Modal
  openProject(project: Project) {
    this.currentProject.set(project);
    // Sanitizamos la URL para que Angular confíe en ella
    this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(project.demoUrl));
    this.isModalOpen.set(true);
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
  }

  // Cerrar Modal
  closeModal() {
    this.isModalOpen.set(false);
    this.currentProject.set(null);
    this.safeUrl.set(null);
    // Reactivar scroll del body
    document.body.style.overflow = 'auto';
  }


}
