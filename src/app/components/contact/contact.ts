import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  isSending = signal(false);
  isSent = signal(false);
  hasError = signal(false);

  async onSubmit(e: Event) {
    e.preventDefault();
    this.isSending.set(true);
    this.hasError.set(false);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch('https://formspree.io/f/mreydzve', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        this.isSent.set(true);
        form.reset();
      } else {
        this.hasError.set(true);
      }
    } catch {
      this.hasError.set(true);
    } finally {
      this.isSending.set(false);
    }
  }
}