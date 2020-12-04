import { Component, OnInit } from '@angular/core';
import { Local } from 'protractor/built/driverProviders';
import { DbService } from '../db.service';
import { LocalStorageService }from '../local-storage.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users:any;
  reviews:any;
  policies:any;

  snp:string;
  aup:string;
  dmca: string;

  constructor(private db : DbService, private ls:LocalStorageService) { }

  ngOnInit(): void {
    this.displayUsers()
    this.displayReviews()
  }

  displayPolicies(){
    this.db.getPolicies().subscribe(data => {
      this.policies = data
      this.snp = this.policies.snp
      this.aup = this.policies.aup
      this.dmca = this.policies.dmca
    })
  }

  displayReviews(){
    this.db.getAdminReviews().subscribe(data =>{
      this.reviews = data
      this.reviews = this.reviews.result
    },error =>{
      alert(error.error)
    })
  }

  changeHiddenStatus(review: any){
    this.db.changeReviewStatus(review.content, review.user, review.date).subscribe(data =>{
      alert(data)
      this.displayReviews();
    },error =>{
      alert(error.error)
    })
  }

  displayUsers(){
    this.db.getUsers().subscribe(data =>{
      this.users = data
      this.users = this.users.result.filter(x => x.email != this.ls.getLog())
    })
  }

  changeManagerStatus(user){
    var email = user.email
    this.db.updateUsers(email, "editmanager").subscribe(data=>{
      alert(data)
      this.displayUsers();
    },error=>{
      alert(error.error)
    })
  }
  changeActiveStatus(user){
    var email = user.email
    this.db.updateUsers(email, "editactive").subscribe(data=>{
      alert(data)
      this.displayUsers();
    },error=>{
      alert(error.error)
    })
  }
}
