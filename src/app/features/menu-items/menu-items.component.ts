import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem } from '../../core/models';
import { MenuItemService } from '../../core/services/menu-item.service';
import { ToastService } from '../../core/services/toast.service';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BtnComponent,
    SearchInputComponent,
    ModalComponent,
    EmptyStateComponent,
    SkeletonComponent,
    BadgeComponent,
    IconComponent,
    CurrencyPipe,
  ],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss',
})
export class MenuItemsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly menuService = inject(MenuItemService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly items = signal<MenuItem[]>([]);
  readonly search = signal('');
  readonly categoryFilter = signal('all');
  readonly availabilityFilter = signal('all');
  readonly showModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly editingItem = signal<MenuItem | null>(null);
  readonly deletingItem = signal<MenuItem | null>(null);

  readonly categories = computed(() => [...new Set(this.items().map((i) => i.category))].sort());

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    category: ['Coffee', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    isAvailable: [true],
  });

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const cat = this.categoryFilter();
    const avail = this.availabilityFilter();

    return this.items().filter((item) => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        String(item.id).includes(q);
      const matchesCat = cat === 'all' || item.category === cat;
      const matchesAvail =
        avail === 'all' ||
        (avail === 'available' && item.isAvailable) ||
        (avail === 'unavailable' && !item.isAvailable);
      return matchesSearch && matchesCat && matchesAvail;
    });
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.menuService.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Could not load menu items.');
      },
    });
  }

  openAdd(): void {
    this.editingItem.set(null);
    this.form.reset({ name: '', category: 'Coffee', price: 0, isAvailable: true });
    this.showModal.set(true);
  }

  openEdit(item: MenuItem): void {
    this.editingItem.set(item);
    this.form.setValue({
      name: item.name,
      category: item.category,
      price: item.price,
      isAvailable: item.isAvailable,
    });
    this.showModal.set(true);
  }

  openDelete(item: MenuItem): void {
    this.deletingItem.set(item);
    this.showDeleteModal.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const payload = this.form.getRawValue();
    const editing = this.editingItem();
    const request$ = editing ? this.menuService.update(editing.id, payload) : this.menuService.create(payload);

    request$.subscribe({
      next: () => {
        this.toast.success(editing ? 'Menu item updated' : 'Menu item added');
        this.showModal.set(false);
        this.saving.set(false);
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Could not save menu item.');
      },
    });
  }

  confirmDelete(): void {
    const item = this.deletingItem();
    if (!item) return;
    this.menuService.delete(item.id).subscribe({
      next: () => {
        this.toast.success('Menu item deleted');
        this.showDeleteModal.set(false);
        this.load();
      },
      error: () => this.toast.error('Could not delete menu item.'),
    });
  }
}
