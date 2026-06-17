import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../../core/models';
import { CustomerService } from '../../core/services/customer.service';
import { ToastService } from '../../core/services/toast.service';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BtnComponent,
    SearchInputComponent,
    ModalComponent,
    EmptyStateComponent,
    SkeletonComponent,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly customers = signal<Customer[]>([]);
  readonly search = signal('');
  readonly showModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly editingCustomer = signal<Customer | null>(null);
  readonly deletingCustomer = signal<Customer | null>(null);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
  });

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.customers();
    return this.customers().filter(
      (c) => c.fullName.toLowerCase().includes(q) || c.phoneNumber.includes(q) || String(c.id).includes(q),
    );
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Could not load customers.');
      },
    });
  }

  openAdd(): void {
    this.editingCustomer.set(null);
    this.form.reset({ fullName: '', phoneNumber: '' });
    this.showModal.set(true);
  }

  openEdit(customer: Customer): void {
    this.editingCustomer.set(customer);
    this.form.setValue({ fullName: customer.fullName, phoneNumber: customer.phoneNumber });
    this.showModal.set(true);
  }

  openDelete(customer: Customer): void {
    this.deletingCustomer.set(customer);
    this.showDeleteModal.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const payload = this.form.getRawValue();
    const editing = this.editingCustomer();

    const request$ = editing
      ? this.customerService.update(editing.id, payload)
      : this.customerService.create(payload);

    request$.subscribe({
      next: () => {
        this.toast.success(editing ? 'Customer updated successfully' : 'Customer added successfully');
        this.showModal.set(false);
        this.saving.set(false);
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Could not save customer.');
      },
    });
  }

  confirmDelete(): void {
    const customer = this.deletingCustomer();
    if (!customer) return;
    this.customerService.delete(customer.id).subscribe({
      next: () => {
        this.toast.success('Customer deleted');
        this.showDeleteModal.set(false);
        this.load();
      },
      error: () => this.toast.error('Could not delete customer.'),
    });
  }
}
