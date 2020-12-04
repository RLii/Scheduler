import { Component, OnInit } from '@angular/core';
import { DbService} from '../db.service';


@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.scss']
})
export class PassResetComponent implements OnInit {

  email:string;
  newpassword:string;
  oldpassword:string;

  constructor(private db: DbService) { }

  ngOnInit(): void {
  }

  updatePassword(){
    this.db.updatePassword(this.email, this.newpassword, this.oldpassword).subscribe(data=>{
      alert(data)
    },error => {
      alert(error.error)
    })
    
  }

}
