import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoPersona } from '../interfaces/tipo-persona';
import { Observable, Subject, tap } from 'rxjs';
import { API_URL } from '../../constants/api';
@Injectable({
  providedIn: 'root'
})
export class TipoPersonaService {


  constructor(private http: HttpClient) { }
  tipoChanged = new Subject<void>();


  getTypes(): Observable<TipoPersona[]> {
    return this.http.get<TipoPersona[]>(`${API_URL}/typeperson`);
  }

  // Obtener un usuario por ID
  getTypeById(id: number): Observable<TipoPersona> {
    return this.http.get<TipoPersona>(`${API_URL}/typeperson/${id}`);
  }

  // Crear un nuevo usuario
  createTypes(tipo: TipoPersona): Observable<TipoPersona> {
    return this.http.post<TipoPersona>(`${API_URL}/typeperson`, tipo).pipe(
      tap(() => {
        this.tipoChanged.next();
      })
    );  }

  // Actualizar un usuario
  updateType(id: number, tipo: TipoPersona): Observable<TipoPersona> {
    return this.http.put<TipoPersona>(`${API_URL}/typeperson/${id}`, tipo).pipe(
      tap(() => {
        this.tipoChanged.next();
      })
    );
  }

  // Eliminar un usuario
  deleteType(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/typeperson/${id}`).pipe(
      tap(() => {
        this.tipoChanged.next();
      })
    );;
  }
}
