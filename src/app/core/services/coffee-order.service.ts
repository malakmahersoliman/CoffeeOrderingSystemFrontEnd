import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CoffeeOrder, CreateCoffeeOrder, UpdateCoffeeOrder } from '../models';

@Injectable({ providedIn: 'root' })
export class CoffeeOrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/CoffeeOrders`;

  getAll(): Observable<CoffeeOrder[]> {
    return this.http.get<CoffeeOrder[]>(this.baseUrl);
  }

  getById(id: number): Observable<CoffeeOrder> {
    return this.http.get<CoffeeOrder>(`${this.baseUrl}/${id}`);
  }

  create(order: CreateCoffeeOrder): Observable<CoffeeOrder> {
    return this.http.post<CoffeeOrder>(this.baseUrl, order);
  }

  update(id: number, order: UpdateCoffeeOrder): Observable<CoffeeOrder> {
    return this.http.put<CoffeeOrder>(`${this.baseUrl}/${id}`, order);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
