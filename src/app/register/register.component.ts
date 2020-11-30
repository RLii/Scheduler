import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  //Login variables
  name: string;
  password: string;
  email: string;

  constructor(private db: DbService) { }

  ngOnInit(): void {
  }

  register() {
    this.db.registerUser(this.name, this.email, this.password).subscribe(data => {
      alert(data)
  }, error =>{
    alert(error.error);
  })
  }
}
