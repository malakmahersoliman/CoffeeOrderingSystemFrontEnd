export interface Customer {
  id: number;
  fullName: string;
  phoneNumber: string;
}

export interface CreateCustomer {
  fullName: string;
  phoneNumber: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
}

export interface CreateMenuItem {
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
}

export interface CoffeeOrderItem {
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface CoffeeOrder {
  id: number;
  customerId: number;
  customerName: string;
  isTakeAway: boolean;
  status: string;
  createdAt: string;
  totalAmount: number;
  items: CoffeeOrderItem[];
}

export interface CreateOrderItem {
  menuItemId: number;
  quantity: number;
}

export interface CreateCoffeeOrder {
  customerId: number;
  isTakeAway: boolean;
  items: CreateOrderItem[];
}

export interface UpdateCoffeeOrder {
  status: string;
  isTakeAway: boolean;
}

export interface DashboardStats {
  totalCustomers: number;
  totalMenuItems: number;
  availableItems: number;
  todaysOrders: number;
  totalRevenue: number;
}

export interface CartLine {
  menuItem: MenuItem;
  quantity: number;
}
