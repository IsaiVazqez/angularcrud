import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interface/user.interface';
import { Observable, Subject, tap } from 'rxjs';
import { API_URL } from '../constants/api';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }
  userChanged = new Subject<void>();


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/user`);
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/user/${id}`);
  }

  // Crear un nuevo usuario
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${API_URL}/user`, user).pipe(
      tap(() => {
        this.userChanged.next();
      })
    );  }

  // Actualizar un usuario
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${API_URL}/user/${id}`, user).pipe(
      tap(() => {
        this.userChanged.next();
      })
    );
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/user/${id}`).pipe(
      tap(() => {
        this.userChanged.next();
      })
    );;
  }
}
