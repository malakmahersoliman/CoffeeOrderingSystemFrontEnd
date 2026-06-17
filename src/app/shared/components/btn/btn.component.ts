import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (link()) {
      <a [routerLink]="link()!" [class]="classes" [class.btn-loading]="loading()">
        @if (loading()) {
          <span class="btn-spinner"></span>
        }
        <ng-content />
      </a>
    } @else {
      <button
        [type]="type()"
        [class]="classes"
        [disabled]="disabled() || loading()"
        [class.btn-loading]="loading()"
      >
        @if (loading()) {
          <span class="btn-spinner"></span>
        }
        <ng-content />
      </button>
    }
  `,
  styleUrl: './btn.component.scss',
})
export class BtnComponent {
  readonly variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  readonly size = input<'sm' | 'md'>('md');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly type = input<'button' | 'submit'>('button');
  readonly link = input<string | null>(null);

  get classes(): string {
    return `btn btn-${this.variant()} btn-${this.size()}`;
  }
}
