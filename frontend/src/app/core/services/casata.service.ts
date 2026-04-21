import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CasataRequest, CasataResponse } from '../../models/casata.model';

@Injectable({ providedIn: 'root' })
export class CasataService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/casate`;

  getAll(): Observable<CasataResponse[]> {
    return this.http.get<CasataResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<CasataResponse> {
    return this.http.get<CasataResponse>(`${this.apiUrl}/${id}`);
  }

  cerca(nome: string): Observable<CasataResponse[]> {
    return this.http.get<CasataResponse[]>(`${this.apiUrl}/cerca`, {
      params: { nome }
    });
  }

  crea(request: CasataRequest): Observable<CasataResponse> {
    return this.http.post<CasataResponse>(this.apiUrl, request);
  }

  aggiorna(id: number, request: CasataRequest): Observable<CasataResponse> {
    return this.http.put<CasataResponse>(`${this.apiUrl}/${id}`, request);
  }

  elimina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}