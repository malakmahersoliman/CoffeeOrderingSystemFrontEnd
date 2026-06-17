import { Component, input } from '@angular/core';

export type IconName =
  | 'dashboard'
  | 'users'
  | 'cup'
  | 'receipt'
  | 'plus'
  | 'search'
  | 'check'
  | 'alert'
  | 'info'
  | 'menu'
  | 'orders'
  | 'money'
  | 'box';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      class="app-icon"
      [class.app-icon-sm]="size() === 'sm'"
      [class.app-icon-lg]="size() === 'lg'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('dashboard') {
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        }
        @case ('users') {
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="8" r="3.5" />
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 4.13a3.5 3.5 0 0 1 0 6.75" />
        }
        @case ('cup') {
          <path d="M6 8h12v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z" />
          <path d="M18 10h1.5a2.5 2.5 0 0 1 0 5H18" />
          <path d="M8 4v2M12 4v2M16 4v2" />
        }
        @case ('receipt') {
          <path d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5L5 21V3z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-3.5-3.5" />
        }
        @case ('check') {
          <path d="M20 6 9 17l-5-5" />
        }
        @case ('alert') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        }
        @case ('info') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        }
        @case ('menu') {
          <path d="M4 7h16M4 12h16M4 17h16" />
        }
        @case ('orders') {
          <path d="M4 6h16M4 12h10M4 18h14" />
        }
        @case ('money') {
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <circle cx="12" cy="12" r="2.5" />
        }
        @case ('box') {
          <path d="M12 3 20 7.5V16.5L12 21 4 16.5V7.5L12 3z" />
          <path d="M12 12 20 7.5M12 12 4 7.5M12 12v9" />
        }
      }
    </svg>
  `,
  styles: `
    .app-icon {
      width: 20px;
      height: 20px;
      display: block;
      flex-shrink: 0;
    }
    .app-icon-sm {
      width: 16px;
      height: 16px;
    }
    .app-icon-lg {
      width: 40px;
      height: 40px;
      stroke-width: 1.5;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}
