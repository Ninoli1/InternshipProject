import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseApi: string = "https://localhost:7252";
  constructor(private http: HttpClient) { }

  registerUser(user: User){
    return this.http.post<any>(this.baseApi + '/api/User/register', user);
  }

  logInUser(user: User){
    return this.http.post<any>(this.baseApi + '/api/User/authenticate', user);
  }

}
