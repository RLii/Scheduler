import { Component, OnInit } from '@angular/core';
import { Local } from 'protractor/built/driverProviders';
import { DbService } from '../db.service';
import { LocalStorageService }from '../local-storage.service';
import { CommonModule }from '@angular/common';
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

  newsnp:string;
  newaup:string;
  newdmca:string;

  constructor(private db : DbService, private ls:LocalStorageService) { }

  ngOnInit(): void {
    this.displayUsers()
    this.displayReviews()
    this.displayPolicies()
  }

  savesnp(){
    this.db.setPolicyContent(this.snp, "snp").subscribe(data=>{
      alert(data)
      this.displayPolicies();
    },error =>{
      alert(error.error)
    })
  }
  saveaup(){
    this.db.setPolicyContent(this.aup, "aup").subscribe(data=>{
      alert(data)
      this.displayPolicies();
    },error =>{
      alert(error.error)
    })
  }
  savedmca(){
    this.db.setPolicyContent(this.dmca, "dmca").subscribe(data=>{
      alert(data)
      this.displayPolicies();
    },error =>{
      alert(error.error)
    })
  }
  createsnp(){this.db.createNewPolicy(this.newsnp, "snp").subscribe(data=>{
    alert(data)
    this.displayPolicies();
  },error =>{
    alert(error.error)
  })
  }
  createaup(){this.db.createNewPolicy(this.newaup, "aup").subscribe(data=>{
    alert(data)
    this.displayPolicies();
  },error =>{
    alert(error.error)
  })
  }
  createdmca(){this.db.createNewPolicy(this.newdmca, "dmca").subscribe(data=>{
    alert(data)
    this.displayPolicies();
  },error =>{
    alert(error.error)
  })
  }

  displayPolicies(){
    this.db.getPolicies().subscribe(data => {
      console.log(data)
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
