import { Component } from '@angular/core';
import { DbService } from './db.service';
import { LocalStorageService} from './local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Scheduler';
  constructor(private db :DbService, private ls: LocalStorageService){}
  verify() {
    this.db.verifyUser().subscribe(data =>{
      var results: any = data
      this.ls.setLog(results.email);
      alert(this.ls.getLog());
    })
  }
}
