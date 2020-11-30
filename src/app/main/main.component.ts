import { Component, OnInit } from '@angular/core';
import { logging } from 'protractor';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  //Login stuff
  username: string;
  password: string;

  constructor() { }

  ngOnInit(): void {
    this.username = "";
    this.password = "";
  }


  login(){
    console.log("LOGIN");
  }
}
