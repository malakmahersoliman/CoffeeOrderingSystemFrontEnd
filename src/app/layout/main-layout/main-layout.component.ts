import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { IconComponent, IconName } from '../../shared/components/icon/icon.component';

interface NavItem {
  label: string;
  route: string;
  icon: IconName;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainerComponent, IconComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Customers', route: '/customers', icon: 'users' },
    { label: 'Menu Items', route: '/menu-items', icon: 'cup' },
    { label: 'Coffee Orders', route: '/orders', icon: 'receipt' },
    { label: 'Create Order', route: '/create-order', icon: 'plus' },
  ];

  readonly today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
