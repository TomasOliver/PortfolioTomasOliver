import {
  Component, signal, output,
  HostListener, ElementRef, inject, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lock-screen.html',
  styleUrl: './lock-screen.css',
})
export class LockScreenComponent implements OnInit, OnDestroy {

  unlocked = output<void>();
  dragProgressChange = output<number>();
  currentTime = signal('');
  currentDate = signal('');
  isLeaving = signal(false);

  private touchStartY = 0;
  private isDragging = false;
  dragOffset = signal(0);
  dragProgress = signal(0);

  private el = inject(ElementRef);

  private touchMoveHandler = (e: TouchEvent) => {
    if (!this.isDragging) return;
    e.preventDefault();
    const delta = this.touchStartY - e.touches[0].clientY;
    if (delta > 0) {
      this.dragOffset.set(delta);
      const progress = Math.min(delta / 800, 1);
      this.dragProgress.set(progress);
      this.dragProgressChange.emit(progress); // ← emit en touch
    }
  };

  constructor() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  ngOnInit() {
    this.el.nativeElement.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('touchmove', this.touchMoveHandler);
  }

  private updateTime() {
    const now = new Date();
    this.currentTime.set(now.toLocaleTimeString('es-AR', {
      hour: '2-digit', minute: '2-digit'
    }));
    this.currentDate.set(now.toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long'
    }));
  }

  onTouchStart(e: TouchEvent) {
    this.touchStartY = e.touches[0].clientY;
    this.isDragging = true;
  }

  onTouchEnd() {
    if (this.dragOffset() > 120) {
      this.triggerUnlock();
    } else {
      this.dragOffset.set(0);
      this.dragProgress.set(0);
      this.dragProgressChange.emit(0); // ← reset en touch
    }
    this.isDragging = false;
  }

  onMouseDown(e: MouseEvent) {
    this.touchStartY = e.clientY;
    this.isDragging = true;
  }

@HostListener('window:mousemove', ['$event'])
onMouseMove(e: MouseEvent) {
  if (!this.isDragging) return;
  const delta = this.touchStartY - e.clientY;
  if (delta > 0) {
    this.dragOffset.set(delta);
    const progress = Math.min(delta / 800, 1); // ← y acá
    this.dragProgress.set(progress);
    this.dragProgressChange.emit(progress);
  }
}

  @HostListener('window:mouseup')
  onMouseUp() {
    if (!this.isDragging) return;
    if (this.dragOffset() > 120) {
      this.triggerUnlock();
    } else {
      this.dragOffset.set(0);
      this.dragProgress.set(0);
      this.dragProgressChange.emit(0); // ← reset en mouse
    }
    this.isDragging = false;
  }

  triggerUnlock() {
    this.isLeaving.set(true);
    this.dragProgressChange.emit(1); // ← emit final al desbloquear
    setTimeout(() => this.unlocked.emit(), 600);
  }
}