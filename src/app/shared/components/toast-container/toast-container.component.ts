import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [class]="'toast toast-' + toast.type" (click)="toastService.dismiss(toast.id)">
          <app-icon [name]="iconFor(toast.type)" size="sm" />
          <span>{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  iconFor(type: string): 'check' | 'alert' | 'info' {
    if (type === 'success') return 'check';
    if (type === 'error') return 'alert';
    return 'info';
  }
}
