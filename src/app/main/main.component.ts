import { Component, OnInit } from '@angular/core';
import { logging } from 'protractor';
import { fromEventPattern } from 'rxjs';
import { DbService }from '../db.service';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  //Login stuff
  email: string;
  password: string;

  constructor(private db:DbService, private router: Router, private ls :LocalStorageService) { }

  ngOnInit(): void {
    this.email = "";
    this.password = "";
  }


  login(){
    this.db.userLogin(this.email, this.password).subscribe(data => {
      this.ls.setToken(data);
      
      alert("Logged in!");
    }, error => {
      alert(error.error);
    })
  }
}
