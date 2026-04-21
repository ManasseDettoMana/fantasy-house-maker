import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PersonaggioRequest, PersonaggioResponse } from '../../models/personaggio.model';

@Injectable({ providedIn: 'root' })
export class PersonaggioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/personaggi`;

  getAll(): Observable<PersonaggioResponse[]> {
    return this.http.get<PersonaggioResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<PersonaggioResponse> {
    return this.http.get<PersonaggioResponse>(`${this.apiUrl}/${id}`);
  }

  getByCasata(casataId: number): Observable<PersonaggioResponse[]> {
    return this.http.get<PersonaggioResponse[]>(`${this.apiUrl}/casata/${casataId}`);
  }

  cerca(nome: string): Observable<PersonaggioResponse[]> {
    return this.http.get<PersonaggioResponse[]>(`${this.apiUrl}/cerca`, {
      params: { nome }
    });
  }

  crea(request: PersonaggioRequest): Observable<PersonaggioResponse> {
    return this.http.post<PersonaggioResponse>(this.apiUrl, request);
  }

  aggiorna(id: number, request: PersonaggioRequest): Observable<PersonaggioResponse> {
    return this.http.put<PersonaggioResponse>(`${this.apiUrl}/${id}`, request);
  }

  elimina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}