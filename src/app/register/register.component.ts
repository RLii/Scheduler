import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { Router } from '@angular/router';
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

  constructor(private db: DbService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    this.db.registerUser(this.name, this.email, this.password).subscribe(data => {
      alert(data)
      this.router.navigateByUrl("/main")
  }, error =>{
    alert(error.error);
  })
  }
}
