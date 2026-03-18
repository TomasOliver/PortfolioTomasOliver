import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { AboutMe } from './components/about-me/about-me';
import { Contact } from './components/contact/contact';
import { Projects } from './components/projects/projects';
import { LockScreenComponent } from './components/lock-screen/lock-screen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Hero, AboutMe, Contact, Projects, LockScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'portfolioTomi';
  isLocked = signal(true);
  hasUnlocked = signal(false); // ← nuevo
  blurAmount = signal(16);

  onUnlocked() {
    this.isLocked.set(false);
    this.hasUnlocked.set(true); // ← se activa cuando termina la animación
  }
  onDragProgress(progress: number) {
    // progress va de 0 a 1, blur va de 16 a 0
    this.blurAmount.set(Math.round(16 * (1 - progress)));
  }
}