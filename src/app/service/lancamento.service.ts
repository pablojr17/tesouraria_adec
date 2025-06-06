import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lancamento } from '../model/lancamento.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LancamentoService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  addEntrada(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post<Lancamento>(`${this.apiUrl}/entradas`, lancamento);
  }

  addSaida(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post<Lancamento>(`${this.apiUrl}/saidas`, lancamento);
  }

}
