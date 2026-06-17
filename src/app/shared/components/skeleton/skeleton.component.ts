import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div class="skeleton-grid">
      @for (i of [1, 2, 3, 4]; track i) {
        <div class="skeleton-card">
          <div class="skeleton-line w-60"></div>
          <div class="skeleton-line w-40"></div>
          <div class="skeleton-line w-80"></div>
        </div>
      }
    </div>
  `,
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {}
