import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BackendService } from './services/backend.service';
import { HttpClient } from '@angular/common/http';

interface User {
  name: string;
  password: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  user: User;
  userForm: any;
  flag: number;

  constructor( private formBuilder: FormBuilder,
               private backendService: BackendService,
               private http: HttpClient ) {
    this.userForm = this.formBuilder.group({
      name: '',
      password: ''
    })
  }

  ngOnInit() {

  }

  onSubmit(user: User) {
    console.log(this.user);
    const name = user.name
    return this.http.get('http://localhost:5000/auth', {
      params: {
        name: user.name,
        password: user.password
      }
    })
      .subscribe(resp => {
        console.log(resp);
        const flag: any = resp
        this.flag = flag.auth;
      })

  }

  title = 'argon-dashboard-angular';
}
