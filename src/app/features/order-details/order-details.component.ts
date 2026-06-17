import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoffeeOrder } from '../../core/models';
import { CoffeeOrderService } from '../../core/services/coffee-order.service';
import { ToastService } from '../../core/services/toast.service';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    BtnComponent,
    CardComponent,
    ModalComponent,
    SkeletonComponent,
    BadgeComponent,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
})
export class OrderDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(CoffeeOrderService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(true);
  readonly order = signal<CoffeeOrder | null>(null);
  readonly showDeleteModal = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getById(id).subscribe({
      next: (data) => {
        this.order.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Order not found');
        this.router.navigate(['/orders']);
      },
    });
  }

  confirmDelete(): void {
    const order = this.order();
    if (!order) return;
    this.orderService.delete(order.id).subscribe({
      next: () => {
        this.toast.success('Order cancelled');
        this.router.navigate(['/orders']);
      },
      error: () => this.toast.error('Could not cancel order'),
    });
  }
}
