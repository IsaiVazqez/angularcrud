import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import { User } from '../interfaces/user.interface';
import { API_URL } from '../../constants/api';
import { userDTO } from '../interfaces/userDTO';
import { MainDTO } from '../interfaces/paginacionDTO';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  userChanged = new Subject<void>();

  getUsers(pageSize: number, pageNumber: number, orderDirection: string): Observable<MainDTO> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString())
      .set('orderDirection', orderDirection);
    return this.http.get<MainDTO>(`${API_URL}/user`, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/user/${id}`);
  }

  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('currentUserId');
    return userId ? +userId : null;
  }


  downloadExcel(){
    return this.http.get(`${API_URL}/user/ExportToExcel`, {responseType: 'blob'});
  }

  createUser(user: userDTO): Observable<User> {
    return this.http.post<User>(`${API_URL}/user`, user).pipe(
      tap(() => {
        this.userChanged.next();
      })
    );  }

  updateUser(id: number, user: userDTO): Observable<User> {
    return this.http.put<User>(`${API_URL}/user/${id}`, user).pipe(
      tap(() => {
        this.userChanged.next();
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/user/${id}`).pipe(
      tap(() => {
        this.userChanged.next();
      })
    );;
  }

}
