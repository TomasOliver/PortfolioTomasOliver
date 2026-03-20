import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl?: string;
  demoUrl?: string;
  images?: string[];  // ← galería de fotos
  type: 'web' | 'console';
}

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {

  private sanitizer = inject(DomSanitizer);

  isModalOpen = signal(false);
  currentProject = signal<Project | null>(null);
  safeUrl = signal<SafeResourceUrl | null>(null);
  currentImageIndex = signal(0); // ← índice de la galería

  projects: Project[] = [
    {
      id: 1,
      title: 'Simulador de Fútbol',
      description: 'Simulación lógica de partidos y torneos desarrollada puramente en C. Gestión de memoria manual y algoritmos de probabilidad para determinar resultados realistas.',
      tags: ['Lenguaje C', 'Algoritmos', 'Estructuras de Datos'],
      image: 'images/SifuEnC.jpeg',
      githubUrl: 'https://github.com/TomasOliver/Tp-final-laboratorio1',
      images: [
        'images/SifuCPortada.jpeg',
        'images/SifuCMenuPrincipal.jpeg',
        'images/SifuCMenuJugar.jpeg',
        'images/SifuCAmistoso.jpeg',
        'images/SifuCAmistosoResultado.jpeg',
        'images/SifuCMenuTorneo.jpeg',
        'images/SifuCFecha2.jpeg',
        'images/SifuCFecha2Resultado.jpeg',
        'images/SifuCFecha2Tabla.jpeg',
        'images/SifuCMenuGuardado.jpeg',
      ],
      type: 'console'
    },
    {
      id: 2,
      title: 'S.I.F.U Copa America Version',
      description: 'Sistema de gestión desarrollado en Java con interfaz de terminal. Permite administrar usuarios, recursos y generar reportes.',
      tags: ['Java', 'POO', 'Terminal'],
      image: 'images/SifuJava.jpeg',
      githubUrl: 'https://github.com/Wuttenberg/S.I.F.U-Copa-America-Version',
      images: [
        'images/SifuJavaMenuPrincipal.jpeg',
        'images/SifuJavaSimulacionGrupos.jpeg',
        'images/SifuJavaResultadoPartido.jpeg',
        'images/SifuJavaTabla.jpeg',
        'images/UMLSifu.png',
        
      ],
      type: 'console'
    },
    {
      id: 3,
      title: 'S.I.F.U Web Premier League',
      description: 'Aplicación web desarrollada en Angular donde podés armar tu equipo, elegir formaciones y simular partidos como director técnico. Utiliza una base de datos en JSON con jugadores reales.',
      tags: ['Angular', 'TypeScript', 'CSS', 'JSON'],
      image: 'images/SifuAngular.jpeg',
      githubUrl: 'https://github.com/TomasOliver/SifuWebTest',
      demoUrl: 'https://sifu-web-test.vercel.app',
      images: [
        'images/SifuWebLogin.jpeg',
        'images/SifuWebInicio.jpeg',
        'images/SifuWebFixture.jpeg',
        'images/SifuWebTabla.jpeg',
        'images/SifuWebEstadisticas.jpeg',
        'images/SifuWebPreviaTorneo.jpeg',
        'images/SifuWebSimularPartidoCompleto.jpeg',
        'images/SifuWebSimularPartidoRapido.jpeg',
        'images/SifuWebInicioCampeon.jpeg',
        'images/SifuWebPanelAdmin.jpeg',
        'images/SifuWebPanelAgregarJugador.jpeg',
        'images/SifuWebGestorBaseDeDatos.jpeg',
        
      ],
      type: 'console'
    }
  ];

  showDemo = signal(false);

  openProject(project: Project) {
    this.currentProject.set(project);
    this.currentImageIndex.set(0);
    this.showDemo.set(false);
    this.safeUrl.set(null); // ← no seteamos la URL hasta que se apriete el botón
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.currentProject.set(null);
    this.safeUrl.set(null);
    this.currentImageIndex.set(0);
    this.showDemo.set(false); // ← reset
    document.body.style.overflow = 'auto';
  }

  playDemo() {
    const url = this.currentProject()?.demoUrl;
    if (url) {
      this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    }
    this.showDemo.set(true);
  }

  nextImage() {
    const images = this.currentProject()?.images ?? [];
    this.currentImageIndex.update(i => (i + 1) % images.length);
  }

  prevImage() {
    const images = this.currentProject()?.images ?? [];
    this.currentImageIndex.update(i => (i - 1 + images.length) % images.length);
  }
}