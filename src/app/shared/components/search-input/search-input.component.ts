import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <label class="search-input" [class.search-input-sm]="size() === 'sm'">
      <app-icon name="search" size="sm" />
      <input
        type="search"
        [placeholder]="placeholder()"
        [ngModel]="value()"
        (ngModelChange)="valueChange.emit($event)"
      />
    </label>
  `,
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  readonly placeholder = input('Search...');
  readonly value = input('');
  readonly size = input<'sm' | 'md'>('md');
  readonly valueChange = output<string>();
}
