import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  baseApiUrl : string= "https://localhost:7252";
  constructor(private http: HttpClient) { 

  }

  getAllCategories():Observable <string[]>{
   return  this.http.get<string[]>(this.baseApiUrl + '/api/Categories')
  
  }

}
