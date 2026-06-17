import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="'card' + (padding() ? '' : ' card-flush')">
      @if (title()) {
        <div class="card-header">
          <h3>{{ title() }}</h3>
          <ng-content select="[card-actions]" />
        </div>
      }
      <ng-content />
    </div>
  `,
  styleUrl: './card.component.scss',
})
export class CardComponent {
  readonly title = input('');
  readonly padding = input(true);
}
