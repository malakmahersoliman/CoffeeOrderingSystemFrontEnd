import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CartLine, Customer, MenuItem } from '../../core/models';
import { CoffeeOrderService } from '../../core/services/coffee-order.service';
import { CustomerService } from '../../core/services/customer.service';
import { MenuItemService } from '../../core/services/menu-item.service';
import { ToastService } from '../../core/services/toast.service';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BtnComponent,
    SearchInputComponent,
    ModalComponent,
    SkeletonComponent,
    BadgeComponent,
    IconComponent,
    CurrencyPipe,
  ],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.scss',
})
export class CreateOrderComponent implements OnInit {
  private readonly orderService = inject(CoffeeOrderService);
  private readonly customerService = inject(CustomerService);
  private readonly menuService = inject(MenuItemService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly step = signal(1);
  readonly loading = signal(true);
  readonly placing = signal(false);
  readonly success = signal(false);
  readonly placedOrderId = signal<number | null>(null);
  readonly customers = signal<Customer[]>([]);
  readonly menuItems = signal<MenuItem[]>([]);
  readonly cart = signal<CartLine[]>([]);
  readonly customerSearch = signal('');
  readonly menuSearch = signal('');
  readonly showAddCustomer = signal(false);
  readonly isTakeAway = signal(false);

  readonly customerForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  });

  readonly filteredCustomers = computed(() => {
    const q = this.customerSearch().toLowerCase();
    return this.customers().filter(
      (c) => !q || c.fullName.toLowerCase().includes(q) || c.phoneNumber.includes(q),
    );
  });

  readonly filteredMenu = computed(() => {
    const q = this.menuSearch().toLowerCase();
    return this.menuItems().filter(
      (m) => !q || m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q),
    );
  });

  readonly selectedCustomerId = signal<number | null>(null);
  readonly selectedCustomer = computed(() =>
    this.customers().find((c) => c.id === this.selectedCustomerId()) ?? null,
  );

  readonly grandTotal = computed(() =>
    this.cart().reduce((sum, line) => sum + line.menuItem.price * line.quantity, 0),
  );

  ngOnInit(): void {
    forkJoin({
      customers: this.customerService.getAll(),
      menuItems: this.menuService.getAll(),
    }).subscribe({
      next: ({ customers, menuItems }) => {
        this.customers.set(customers);
        this.menuItems.set(menuItems);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Could not load order data.');
      },
    });
  }

  selectCustomer(id: number): void {
    this.selectedCustomerId.set(id);
  }

  getQty(itemId: number): number {
    return this.cart().find((l) => l.menuItem.id === itemId)?.quantity ?? 0;
  }

  changeQty(item: MenuItem, delta: number): void {
    if (!item.isAvailable && delta > 0) {
      this.toast.error('This menu item is unavailable');
      return;
    }
    const current = this.getQty(item.id);
    const next = current + delta;
    if (next < 0) return;
    if (next > 20) return;

    this.cart.update((lines) => {
      const copy = [...lines];
      const idx = copy.findIndex((l) => l.menuItem.id === item.id);
      if (next === 0) {
        if (idx >= 0) copy.splice(idx, 1);
      } else if (idx >= 0) {
        copy[idx] = { ...copy[idx], quantity: next };
      } else {
        copy.push({ menuItem: item, quantity: next });
      }
      return copy;
    });
  }

  nextStep(): void {
    if (this.step() === 1 && !this.selectedCustomerId()) {
      this.toast.error('Please select a customer');
      return;
    }
    if (this.step() === 2 && this.cart().length === 0) {
      this.toast.error('Add at least one menu item');
      return;
    }
    this.step.update((s) => Math.min(3, s + 1));
  }

  prevStep(): void {
    this.step.update((s) => Math.max(1, s - 1));
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    this.customerService.create(this.customerForm.getRawValue()).subscribe({
      next: (customer) => {
        this.customers.update((list) => [...list, customer]);
        this.selectedCustomerId.set(customer.id);
        this.showAddCustomer.set(false);
        this.toast.success('Customer added');
      },
      error: () => this.toast.error('Could not add customer'),
    });
  }

  placeOrder(): void {
    const customerId = this.selectedCustomerId();
    if (!customerId || this.cart().length === 0) return;

    this.placing.set(true);
    this.orderService
      .create({
        customerId,
        isTakeAway: this.isTakeAway(),
        items: this.cart().map((l) => ({ menuItemId: l.menuItem.id, quantity: l.quantity })),
      })
      .subscribe({
        next: (order) => {
          this.placing.set(false);
          this.success.set(true);
          this.placedOrderId.set(order.id);
          this.toast.success('Order placed successfully');
        },
        error: (err) => {
          this.placing.set(false);
          const msg = err?.error?.message ?? 'Could not place order';
          this.toast.error(msg);
        },
      });
  }

  reset(): void {
    this.step.set(1);
    this.cart.set([]);
    this.selectedCustomerId.set(null);
    this.success.set(false);
    this.placedOrderId.set(null);
  }
}
