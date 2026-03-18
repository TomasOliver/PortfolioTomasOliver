import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'typewriter',
  standalone: true
})
export class TypewriterPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, isVisible: boolean, baseDelay: number = 0, animateOut: boolean = false): SafeHtml {

    const spans = text.split('').map((char, i) => {
      const content = char === ' ' ? '&nbsp;' : char;

      if (animateOut) {
        // Las letras desaparecen en orden inverso
        const totalChars = text.length;
        const delay = baseDelay + ((totalChars - 1 - i) * 30);
        return `<span style="
          opacity: 1;
          display: inline-block;
          animation: letterDisappear 0.25s ease forwards;
          animation-delay: ${delay}ms;
        ">${content}</span>`;
      } else {
        const delay = baseDelay + (i * 40);
        return `<span style="
          opacity: 0;
          display: inline-block;
          animation: letterAppear 0.3s ease forwards;
          animation-delay: ${delay}ms;
        ">${content}</span>`;
      }
    }).join('');

    return this.sanitizer.bypassSecurityTrustHtml(spans);
  }
}