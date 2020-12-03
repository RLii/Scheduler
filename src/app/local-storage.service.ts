import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  token: string;
  loggedIn: string;
  admin: boolean;

  constructor() {this.token = "", this.loggedIn = undefined, this.admin = false }

  setToken(token: string){
    this.token = token;
  }
  getToken(){
    return this.token;
  }
  setLog(temp : string){
    this.loggedIn = temp;
  }
  getLog(){
    return this.loggedIn;
  }
  adminTrue(){
    this.admin = true;
  }
  isAdmin(){
    return this.admin;
  }
}
