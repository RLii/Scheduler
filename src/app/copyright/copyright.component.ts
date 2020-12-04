import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent implements OnInit {

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

}
