import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private router: Router, private authService: AuthService, private ls : LocalStorageService){}

  canActivate(){
    if(this.ls.getLog() != undefined)
    {
      return true;
    }
    else
    {
      this.router.navigateByUrl("main");
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate{

  constructor(private router: Router, private authService: AuthService, private ls : LocalStorageService){}

  canActivate(){
    if(this.ls.isAdmin())
    {
      return true;
    }
    else
    {
      this.router.navigateByUrl("main");
      return false;
    }
  }
}