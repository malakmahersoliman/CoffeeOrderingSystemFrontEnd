import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customers.component').then((m) => m.CustomersComponent),
      },
      {
        path: 'menu-items',
        loadComponent: () =>
          import('./features/menu-items/menu-items.component').then((m) => m.MenuItemsComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/coffee-orders/coffee-orders.component').then((m) => m.CoffeeOrdersComponent),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./features/order-details/order-details.component').then((m) => m.OrderDetailsComponent),
      },
      {
        path: 'create-order',
        loadComponent: () =>
          import('./features/create-order/create-order.component').then((m) => m.CreateOrderComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
