import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  user: any;

  constructor( private http: HttpClient ) { }

  getData() {
    return this.http.get(`http://localhost:5000/data`);
  }
  getReviews() {
    return this.http.get(`http://localhost:5000/reviews`);
  }
  getStock() {
    return this.http.get(`http://localhost:5000/stock`);
  }
  getSales() {
    return this.http.get(`http://localhost:5000/sales`);
  }
  getAuth() {
    return this.http.post('http://localhost:5000/auth', this.user)
      .subscribe(resp => {
        console.log(resp);
      });
  }
}
