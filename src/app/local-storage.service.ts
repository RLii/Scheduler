import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  token: string;
  loggedIn: string;

  constructor() {this.token = "", this.loggedIn = undefined }

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
}
