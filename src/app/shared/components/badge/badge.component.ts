import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span [class]="'badge badge-' + variant()">{{ label() }}</span>`,
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  readonly label = input('');
  readonly variant = input<'success' | 'danger' | 'neutral' | 'warning' | 'info'>('neutral');
}
