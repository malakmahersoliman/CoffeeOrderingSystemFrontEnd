import { Component, input } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        <app-icon [name]="icon()" size="lg" />
      </div>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      <ng-content />
    </div>
  `,
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  readonly icon = input<IconName>('box');
  readonly title = input('Nothing here yet');
  readonly message = input('Get started by adding your first item.');
}
