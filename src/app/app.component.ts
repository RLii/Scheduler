import { Component } from '@angular/core';
import { DbService } from './db.service';
import { LocalStorageService} from './local-storage.service';
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  login: boolean;
  title = 'Scheduler';
  constructor(private db :DbService, private ls: LocalStorageService, private router: Router){this.login = false}
  verifyCourse() {
    this.db.verifyUser().subscribe(data =>{
      var results: any = data
      this.ls.setLog(results.email);
      this.router.navigateByUrl("courses")
      alert(this.ls.getLog());
    })
  }
  verifySchedule(){
    this.db.verifyUser().subscribe(data =>{
      var results: any = data
      this.ls.setLog(results.email);
      this.router.navigateByUrl("schedules")
      alert(this.ls.getLog());
    })
  }
  NewLogin(){
    this.login = true;
  }
}
