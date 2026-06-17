import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="modal-backdrop" (click)="onBackdrop()">
        <div class="modal-panel" role="dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ title() }}</h3>
            <button type="button" class="modal-close" (click)="closed.emit()" aria-label="Close">×</button>
          </div>
          <div class="modal-body">
            <ng-content />
          </div>
          @if (showFooter()) {
            <div class="modal-footer">
              <ng-content select="[modal-footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly showFooter = input(true);
  readonly closeOnBackdrop = input(true);
  readonly closed = output<void>();

  onBackdrop(): void {
    if (this.closeOnBackdrop()) {
      this.closed.emit();
    }
  }
}
