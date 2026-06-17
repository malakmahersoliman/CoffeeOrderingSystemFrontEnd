import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateMenuItem, MenuItem } from '../models';

@Injectable({ providedIn: 'root' })
export class MenuItemService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/MenuItems`;

  getAll(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.baseUrl);
  }

  getById(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.baseUrl}/${id}`);
  }

  create(item: CreateMenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.baseUrl, item);
  }

  update(id: number, item: CreateMenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.baseUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
