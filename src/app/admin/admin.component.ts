import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users:any;

  constructor(private db : DbService) { }

  ngOnInit(): void {
    this.displayUsers()
  }

  displayUsers(){
    this.db.getUsers().subscribe(data =>{
      this.users = data
      this.users = this.users.result
    })
  }

  changeManagerStatus(user){
    this.db.updateUsers(user.email, "editmanager").subscribe(data=>{
      alert(data)
      this.displayUsers();
    },error=>{
      alert(error.error)
    })
  }
  changeActiveStatus(user){
    this.db.updateUsers(user.email, "editactive").subscribe(data=>{
      alert(data)
      this.displayUsers();
    },error=>{
      alert(error.error)
    })
  }
}
