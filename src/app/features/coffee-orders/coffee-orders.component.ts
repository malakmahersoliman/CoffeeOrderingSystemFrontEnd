import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CoffeeOrder, Customer } from '../../core/models';
import { CoffeeOrderService } from '../../core/services/coffee-order.service';
import { CustomerService } from '../../core/services/customer.service';
import { ToastService } from '../../core/services/toast.service';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-coffee-orders',
  standalone: true,
  imports: [
    RouterLink,
    BtnComponent,
    SearchInputComponent,
    ModalComponent,
    EmptyStateComponent,
    SkeletonComponent,
    BadgeComponent,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './coffee-orders.component.html',
  styleUrl: './coffee-orders.component.scss',
})
export class CoffeeOrdersComponent implements OnInit {
  private readonly orderService = inject(CoffeeOrderService);
  private readonly customerService = inject(CustomerService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly orders = signal<CoffeeOrder[]>([]);
  readonly customers = signal<Customer[]>([]);
  readonly search = signal('');
  readonly customerFilter = signal('all');
  readonly showDeleteModal = signal(false);
  readonly deletingOrder = signal<CoffeeOrder | null>(null);

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const cust = this.customerFilter();

    return this.orders().filter((order) => {
      const matchesSearch =
        !q ||
        String(order.id).includes(q) ||
        order.customerName.toLowerCase().includes(q);
      const matchesCustomer = cust === 'all' || String(order.customerId) === cust;
      return matchesSearch && matchesCustomer;
    });
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({
      orders: this.orderService.getAll(),
      customers: this.customerService.getAll(),
    }).subscribe({
      next: ({ orders, customers }) => {
        this.orders.set(orders);
        this.customers.set(customers);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Could not load orders.');
      },
    });
  }

  openDelete(order: CoffeeOrder): void {
    this.deletingOrder.set(order);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const order = this.deletingOrder();
    if (!order) return;
    this.orderService.delete(order.id).subscribe({
      next: () => {
        this.toast.success('Order cancelled');
        this.showDeleteModal.set(false);
        this.load();
      },
      error: () => this.toast.error('Could not cancel order.'),
    });
  }
}
