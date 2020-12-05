import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent implements OnInit {

  content:string;
  user:string;
  date:string;
  reason:string;

  policies:any;

  constructor(private db: DbService) { }

  ngOnInit(): void {
    this.getPolicies();
  }

  getPolicies(){
    this.db.getPolicies().subscribe(data =>{
      this.policies = data
    })
  }

  sendComplaint(){
    this.db.takedownRequest(this.content, this.user, this.date, this.reason).subscribe(data =>{
      alert(data)
    },error =>{
      alert(error.error)
    })
  }

}
