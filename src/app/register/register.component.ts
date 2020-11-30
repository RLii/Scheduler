import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import * as bcrypt from 'bcryptjs';
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
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    console.log(bcrypt.compareSync(this.password, hash));
    this.db.registerUser(this.name, this.email, hash).subscribe(data => {
      alert(data)
  }, error =>{
    alert(error.error);
  })
  }
}
