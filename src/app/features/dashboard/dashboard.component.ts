import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CoffeeOrder, MenuItem } from '../../core/models';
import { CoffeeOrderService } from '../../core/services/coffee-order.service';
import { CustomerService } from '../../core/services/customer.service';
import { MenuItemService } from '../../core/services/menu-item.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, SkeletonComponent, BadgeComponent, IconComponent, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly menuItemService = inject(MenuItemService);
  private readonly orderService = inject(CoffeeOrderService);

  readonly loading = signal(true);
  readonly customers = signal(0);
  readonly menuItems = signal<MenuItem[]>([]);
  readonly orders = signal<CoffeeOrder[]>([]);

  readonly availableCount = computed(() => this.menuItems().filter((m) => m.isAvailable).length);
  readonly todaysOrders = computed(() => {
    const today = new Date().toDateString();
    return this.orders().filter((o) => new Date(o.createdAt).toDateString() === today).length;
  });
  readonly totalRevenue = computed(() => this.orders().reduce((sum, o) => sum + o.totalAmount, 0));
  readonly recentOrders = computed(() =>
    [...this.orders()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
  );
  readonly popularItems = computed(() => {
    const counts = new Map<string, number>();
    for (const order of this.orders()) {
      for (const item of order.items) {
        counts.set(item.menuItemName, (counts.get(item.menuItemName) ?? 0) + item.quantity);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));
  });

  ngOnInit(): void {
    forkJoin({
      customers: this.customerService.getAll(),
      menuItems: this.menuItemService.getAll(),
      orders: this.orderService.getAll(),
    }).subscribe({
      next: ({ customers, menuItems, orders }) => {
        this.customers.set(customers.length);
        this.menuItems.set(menuItems);
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
