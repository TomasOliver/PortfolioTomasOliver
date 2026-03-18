import { Component, signal, HostListener, input, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypewriterPipe } from '../../shared/pipes/typewriter-pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TypewriterPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  isOpen = signal(false);
  isScrolled = signal(false);
  isDark = signal(true);
  isVisible = signal(false);
  isHovered = signal(false);

  // 'visible' | 'hiding' | 'hidden' | 'showing'
  textState = signal<'visible' | 'hiding' | 'hidden' | 'showing'>('visible');

  private hideTimeout: any;

  unlocked = input<boolean>(false);

  menuItems = [
    {
      label: 'Inicio',
      link: '#',
      svgPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      label: 'Sobre Mí',
      link: '#sobre-mi',
      svgPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    {
      label: 'Proyectos',
      link: '#proyectos',
      svgPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
    },
    {
      label: 'Contacto',
      link: '#contacto',
      svgPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
  ];

  constructor() {
    effect(() => {
      if (this.unlocked()) {
        setTimeout(() => this.isVisible.set(true), 400);
      }
    });
  }

  toggleMenu() {
    this.isOpen.update(value => !value);
  }

  toggleTheme() {
    this.isDark.update(value => !value);
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrolled = window.scrollY > 50;

    if (scrolled === this.isScrolled()) return;

    this.isScrolled.set(scrolled);

    if (scrolled && !this.isHovered()) {
      // Scroll hacia abajo: letras desaparecen → ícono aparece
      this.textState.set('hiding');
      clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(() => {
        this.textState.set('hidden');
      }, 400);
    } else if (!scrolled) {
      // Scroll hacia arriba: primero ícono desaparece, luego expande y aparecen letras
      clearTimeout(this.hideTimeout);
      this.textState.set('showing');
      this.hideTimeout = setTimeout(() => {
        this.textState.set('visible');
      }, 300);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovered.set(true);
    clearTimeout(this.hideTimeout);
    if (this.textState() === 'hidden') {
      // Primero estado showing: el ícono desaparece antes de que expanda el ancho
      this.textState.set('showing');
      setTimeout(() => this.textState.set('visible'), 300);
    } else {
      this.textState.set('visible');
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovered.set(false);
    if (this.isScrolled()) {
      this.textState.set('hiding');
      this.hideTimeout = setTimeout(() => {
        this.textState.set('hidden');
      }, 400);
    }
  }
}