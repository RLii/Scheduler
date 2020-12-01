import { Component, OnInit } from '@angular/core';
import { logging } from 'protractor';
import { fromEventPattern } from 'rxjs';
import { DbService }from '../db.service';
import { LocalStorageService } from '../local-storage.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  //Login stuff
  email: string;
  password: string;

  constructor(private db:DbService) { }

  ngOnInit(): void {
    this.email = "";
    this.password = "";
  }


  login(){
    this.db.userLogin(this.email, this.password).subscribe(data => {
      alert(data);
    }, error => {
      alert(error.error);
    })
  }
}
